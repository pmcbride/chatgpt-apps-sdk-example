# Route 53 Data Source (Existing Zone)
data "aws_route53_zone" "main" {
  name = "pmmcbride.com"
}

# App Runner Custom Domain Association
resource "aws_apprunner_custom_domain_association" "mcp" {
  domain_name = "mcp.pmmcbride.com"
  service_arn = aws_apprunner_service.mcp_server.arn
}

# DNS Record (if App Runner doesn't manage it automatically, but usually
# custom_domain_association handles the certificate validation records.
# We might need to add CNAMEs for validation if App Runner requires it).
# App Runner usually asks you to add specific CNAMEs.
# For automation, we can try to assume the record is the CNAME to the service URL
# but App Runner's certificate validation is the tricky part to automate fully
# without manual intervention or advanced modules.

# For now, we output the instructions or attempt to create the Alias if supported.
# App Runner <-> Route53 integration is often cleaner via CNAME.

resource "aws_route53_record" "mcp_cname" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "mcp"
  type    = "CNAME"
  ttl     = 300
  records = [aws_apprunner_service.mcp_server.service_url]
}

# Note: Certificate validation records might still need to be added manually
# or outputted by creating the association first and reading its status.
