terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "pmmcbride-terraform-state"
    key            = "mcp-server/terraform.tfstate"
    region         = "us-west-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = "us-west-1"

  default_tags {
    tags = {
      Project     = "mcp-server"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

variable "environment" {
  description = "Deployment environment (dev or prod)"
  type        = string
  default     = "dev"
}
