variable "mcp_api_url" {
  description = "URL of the backend API"
  type        = string
  default     = "https://api.pmmcbride.com/v1"
}

variable "api_key" {
  description = "API Key for backend authentication"
  type        = string
  sensitive   = true
}

resource "aws_apprunner_service" "mcp_server" {
  service_name = "mcp-server-${var.environment}"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_access_role.arn
    }

    image_repository {
      image_identifier      = "${aws_ecr_repository.mcp_server.repository_url}:latest"
      image_repository_type = "ECR"

      image_configuration {
        port = "3000"
        runtime_environment_variables = {
          MCP_API_URL = var.mcp_api_url
          API_KEY     = var.api_key
          PORT        = "3000"
        }
        # Force HTTP mode for cloud deployment
        # The command in Dockerfile or here should ensure "mode=http" is passed
        # but we can also handle it via ENV if the code supports it.
        # For now, we rely on the Docker CMD or ENTRYPOINT.
      }
      start_command = "node dist/server.js mode=http"
    }
  }

  instance_configuration {
    cpu    = "1024"
    memory = "2048"
  }

  tags = {
    Name = "mcp-server-${var.environment}"
  }
}

# IAM Role for App Runner to access ECR
resource "aws_iam_role" "apprunner_access_role" {
  name = "AppRunnerECRAccessRole-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apprunner_access_policy" {
  role       = aws_iam_role.apprunner_access_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

output "app_runner_service_url" {
  value = aws_apprunner_service.mcp_server.service_url
}
