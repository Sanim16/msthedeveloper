variable "aws_region" { type = string default = "eu-central-1" }
variable "domain_name" { type = string default = "msthedeveloper.com" }
variable "github_repository" { type = string default = "Sanim16/msthedeveloper" }
variable "github_repository_id" { type = string }
variable "github_branch" { type = string default = "main" }
variable "price_class" {
  type = string
  default = "PriceClass_100"
  validation { condition = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.price_class) error_message = "Invalid CloudFront price class." }
}
