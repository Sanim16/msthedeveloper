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

resource "aws_iam_role_policy" "github_terraform_apply_app_infra" {
  name = "terraform-apply-app-infra"
  role = aws_iam_role.github_terraform_apply.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "S3SiteBucket"
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:GetBucketAcl",
          "s3:GetBucketPolicy",
          "s3:PutBucketPolicy",
          "s3:DeleteBucketPolicy",
          "s3:GetBucketTagging",
          "s3:PutBucketTagging",
          "s3:GetBucketVersioning",
          "s3:PutBucketVersioning",
          "s3:GetEncryptionConfiguration",
          "s3:PutEncryptionConfiguration",
          "s3:GetBucketPublicAccessBlock",
          "s3:PutBucketPublicAccessBlock",
          "s3:GetBucketOwnershipControls",
          "s3:PutBucketOwnershipControls",
          "s3:GetBucketObjectLockConfiguration",
          "s3:GetBucketLogging",
          "s3:GetBucketWebsite",
          "s3:GetBucketCORS",
          "s3:GetBucketRequestPayment",
          "s3:GetAccelerateConfiguration",
          "s3:GetReplicationConfiguration",
          "s3:GetLifecycleConfiguration",
          "s3:GetBucketNotification"
        ]
        Resource = "arn:aws:s3:::msthedeveloper-site-*"
      },
      {
        Sid    = "CloudFrontUnscopable"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateDistribution",
          "cloudfront:CreateOriginAccessControl",
          "cloudfront:GetOriginAccessControl",
          "cloudfront:UpdateOriginAccessControl",
          "cloudfront:DeleteOriginAccessControl"
        ]
        # CreateDistribution has no resource type before the distribution exists, and
        # CloudFront OAC actions have no resource-level permission support at all.
        Resource = "*"
      },
      {
        Sid    = "CloudFrontDistribution"
        Effect = "Allow"
        Action = [
          "cloudfront:GetDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:UpdateDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:TagResource",
          "cloudfront:ListTagsForResource"
        ]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*"
      },
      {
        Sid      = "Route53CreateZone"
        Effect   = "Allow"
        Action   = ["route53:CreateHostedZone"]
        Resource = "*" # no resource type exists before the zone is created
      },
      {
        Sid    = "Route53Zone"
        Effect = "Allow"
        Action = [
          "route53:GetHostedZone",
          "route53:DeleteHostedZone",
          "route53:ChangeResourceRecordSets",
          "route53:ListResourceRecordSets",
          "route53:ChangeTagsForResource",
          "route53:ListTagsForResource"
        ]
        Resource = "arn:aws:route53:::hostedzone/*"
      },
      {
        Sid      = "Route53Change"
        Effect   = "Allow"
        Action   = ["route53:GetChange"]
        Resource = "arn:aws:route53:::change/*"
      },
      {
        Sid      = "AcmRequest"
        Effect   = "Allow"
        Action   = ["acm:RequestCertificate"]
        Resource = "*" # no resource type exists before the certificate is created
      },
      {
        Sid    = "AcmCertificate"
        Effect = "Allow"
        Action = [
          "acm:DescribeCertificate",
          "acm:DeleteCertificate",
          "acm:AddTagsToCertificate",
          "acm:RemoveTagsFromCertificate",
          "acm:ListTagsForCertificate",
          "acm:GetCertificate"
        ]
        Resource = "arn:aws:acm:us-east-1:${data.aws_caller_identity.current.account_id}:certificate/*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_terraform_apply_iam_bootstrap" {
  name = "terraform-apply-iam-bootstrap"
  role = aws_iam_role.github_terraform_apply.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "OidcProvider"
        Effect = "Allow"
        Action = [
          "iam:CreateOpenIDConnectProvider",
          "iam:GetOpenIDConnectProvider",
          "iam:UpdateOpenIDConnectProviderThumbprint",
          "iam:DeleteOpenIDConnectProvider",
          "iam:TagOpenIDConnectProvider",
          "iam:UntagOpenIDConnectProvider"
        ]
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
      },
      {
        # Self-managing bootstrap pattern: this role also manages the three
        # msthedeveloper-github-* roles (including itself) and their policies.
        Sid    = "GithubOidcRoles"
        Effect = "Allow"
        Action = [
          "iam:CreateRole",
          "iam:GetRole",
          "iam:DeleteRole",
          "iam:UpdateRole",
          "iam:UpdateAssumeRolePolicy",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:ListRoleTags",
          "iam:PutRolePolicy",
          "iam:GetRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:ListRolePolicies",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole"
        ]
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/msthedeveloper-github-*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_terraform_apply_state_backend" {
  name = "terraform-apply-state-backend"
  role = aws_iam_role.github_terraform_apply.id

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
