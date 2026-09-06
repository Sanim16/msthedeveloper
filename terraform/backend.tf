terraform {
  backend "s3" {
    bucket       = "unique-bucket-name-msctf"
    key          = "msthedeveloper-site/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
