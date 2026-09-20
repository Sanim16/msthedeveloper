resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github.certificates[0].sha1_fingerprint]
}
resource "aws_iam_role" "github_deploy" {
  name = "msthedeveloper-github-deploy"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn },
      Action    = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" },
        StringLike   = { "token.actions.githubusercontent.com:sub" = local.github_repository_sub }
      }
    }]
  })
}
resource "aws_iam_role_policy" "github_deploy" {
  name = "msthedeveloper-site-deploy"
  role = aws_iam_role.github_deploy.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Sid = "ListBucket", Effect = "Allow", Action = ["s3:ListBucket"], Resource = aws_s3_bucket.site.arn },
      { Sid = "WriteWebsite", Effect = "Allow", Action = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"], Resource = "${aws_s3_bucket.site.arn}/*" },
      { Sid = "InvalidateCloudFront", Effect = "Allow", Action = ["cloudfront:CreateInvalidation"], Resource = aws_cloudfront_distribution.site.arn }
    ]
  })
}

locals {
  github_repository_owner = split("/", var.github_repository)[0]
  github_repository_name  = split("/", var.github_repository)[1]

  github_plan_sub_patterns = [
    "repo:${var.github_repository}:pull_request"
  ]

  github_apply_sub_patterns = [
    "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}",
    local.github_repository_sub
  ]
}

resource "aws_iam_role" "github_terraform_plan" {
  name = "msthedeveloper-github-terraform-plan"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = local.github_plan_sub_patterns
        }
      }
    }]
  })

  tags = {
    Name      = "msthedeveloper-github-terraform-plan"
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role_policy_attachment" "github_terraform_plan_read_only" {
  role       = aws_iam_role.github_terraform_plan.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

resource "aws_iam_role_policy" "github_terraform_plan_backend" {
  name = "terraform-backend-access"
  role = aws_iam_role.github_terraform_plan.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]

        Resource = [
          "arn:aws:s3:::unique-bucket-name-msctf/msthedeveloper-site/terraform.tfstate",
          "arn:aws:s3:::unique-bucket-name-msctf/msthedeveloper-site/terraform.tfstate.tflock"
        ]
      },
      {
        Effect = "Allow"

        Action = [
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ]

        Resource = "arn:aws:s3:::unique-bucket-name-msctf"

        Condition = {
          StringLike = {
            "s3:prefix" = [
              "msthedeveloper-site/*"
            ]
          }
        }
      },
      {
        Effect = "Allow"

        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:GenerateDataKey"
        ]

        Resource = "arn:aws:kms:us-east-1:771700505853:key/3e5a66e8-ccc2-4eb0-b32b-d3e5a9f0847c"
      }
    ]
  })
}

resource "aws_iam_role" "github_terraform_apply" {
  name = "msthedeveloper-github-terraform-apply"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      },
      Action = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = local.github_apply_sub_patterns
        }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "github_terraform_apply_power_user" {
  role       = aws_iam_role.github_terraform_apply.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}

resource "aws_iam_role_policy_attachment" "github_terraform_apply_iam" {
  role       = aws_iam_role.github_terraform_apply.name
  policy_arn = "arn:aws:iam::aws:policy/IAMFullAccess"
}
