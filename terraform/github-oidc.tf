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
