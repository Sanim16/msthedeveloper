locals {
  aliases               = [var.domain_name, "www.${var.domain_name}"]
  github_repository_sub = "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"
}
