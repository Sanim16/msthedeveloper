output "site_bucket_name" { value = aws_s3_bucket.site.bucket }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.site.id }
output "cloudfront_domain_name" { value = aws_cloudfront_distribution.site.domain_name }
output "website_url" { value = "https://${var.domain_name}" }
output "route53_nameservers" { value = aws_route53_zone.site.name_servers }
output "route53_zone_id" { value = aws_route53_zone.site.zone_id }
output "github_deploy_role_arn" { value = aws_iam_role.github_deploy.arn }
output "aws_account_id" { value = data.aws_caller_identity.current.account_id }
output "github_terraform_plan_role_arn" {
  description = "IAM role used by GitHub Actions for Terraform plans."
  value       = aws_iam_role.github_terraform_plan.arn
}

output "github_terraform_apply_role_arn" {
  description = "IAM role used by GitHub Actions for Terraform applies."
  value       = aws_iam_role.github_terraform_apply.arn
}
