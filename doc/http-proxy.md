# HTTP Proxy Service

This document provides information about the open HTTP proxy service available at sys-dev-run.re.

**Date:** 2025-12-23

---

## Overview

The HTTP proxy service provides an open proxy endpoint for accessing any HTTPS resource. This proxy can be useful for:

- Bypassing CORS restrictions in web applications
- Providing a consistent endpoint for API access
- Simplifying client-side requests to external services
- Accessing resources that may be blocked or restricted

---

## Proxy Endpoint

**Base URL:** `https://gtfs-proxy.sys-dev-run.re/proxy/`

### How It Works

The proxy accepts the target URL as a path parameter after the `/proxy/` endpoint. The proxy automatically forwards the request to the specified URL and returns the response.

**Format:**
```
https://gtfs-proxy.sys-dev-run.re/proxy/{target-url}
```

Where `{target-url}` is the destination URL **without** the protocol (`https://`).

---

## Usage Examples

### Example 1: Accessing an API Endpoint

**Target URL:** `https://pysae.com/api/v2/groups/car-jaune/gtfs/pub`

**Proxied URL:**
```
https://gtfs-proxy.sys-dev-run.re/proxy/pysae.com/api/v2/groups/car-jaune/gtfs/pub
```

### Example 2: Generic Usage

To proxy any HTTPS request, remove the `https://` prefix from the target URL and append it to the proxy base URL:

**Target:** `https://example.com/api/data`
**Proxied:** `https://gtfs-proxy.sys-dev-run.re/proxy/example.com/api/data`

**Target:** `https://api.example.com/v1/users?page=2`
**Proxied:** `https://gtfs-proxy.sys-dev-run.re/proxy/api.example.com/v1/users?page=2`

---

## Implementation Examples

### JavaScript/Fetch API

```javascript
// Direct request (may face CORS issues)
// const url = 'https://api.example.com/data';

// Using the proxy
const proxyUrl = 'https://gtfs-proxy.sys-dev-run.re/proxy/api.example.com/data';

fetch(proxyUrl)
  .then(response => response.json())
  .then(data => {
    console.log('Data received:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### JavaScript/Axios

```javascript
import axios from 'axios';

const proxyUrl = 'https://gtfs-proxy.sys-dev-run.re/proxy/api.example.com/data';

axios.get(proxyUrl)
  .then(response => {
    console.log('Data received:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Python

```python
import requests

proxy_url = 'https://gtfs-proxy.sys-dev-run.re/proxy/api.example.com/data'

response = requests.get(proxy_url)

if response.status_code == 200:
    data = response.json()
    print('Data received:', data)
else:
    print(f'Error: {response.status_code}')
```

### cURL

```bash
# GET request
curl "https://gtfs-proxy.sys-dev-run.re/proxy/api.example.com/data"

# Download binary file
curl -o file.zip \
  "https://gtfs-proxy.sys-dev-run.re/proxy/example.com/files/download.zip"

# POST request
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}' \
  "https://gtfs-proxy.sys-dev-run.re/proxy/api.example.com/endpoint"
```

---

## Technical Details

### Request Forwarding

The proxy forwards:
- **HTTP Methods:** GET, POST, PUT, DELETE, PATCH, etc.
- **Headers:** Most headers are forwarded to the target server
- **Query Parameters:** Preserved in the proxied request
- **Request Body:** Forwarded for POST/PUT/PATCH requests

### Response Handling

The proxy returns:
- **Status Codes:** Original status code from the target server
- **Headers:** Response headers from the target server
- **Body:** Unmodified response body (binary or text)

### CORS Support

The proxy adds appropriate CORS headers to enable cross-origin requests from web browsers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Use Cases

### 1. Web Application Development
Bypass CORS restrictions when building web applications that need to access external APIs from browsers.

### 2. API Integration
Simplify integration with third-party APIs that don't provide CORS headers or have restrictive access policies.

### 3. API Testing
Test external APIs without worrying about CORS issues during development.

### 4. Data Collection
Download and collect data from various sources through a unified endpoint.

### 5. Prototype Development
Quickly prototype applications that consume external APIs without backend infrastructure.

---

## Important Considerations

### Security
- This is an **open proxy** - use it responsibly
- Do not use it to proxy sensitive or private data
- Do not use it for authentication-required endpoints with credentials
- The proxy operator may log requests for monitoring purposes
- Be aware that your requests pass through a third-party server

### Rate Limiting
- The proxy may implement rate limiting to prevent abuse
- Consider caching responses on your end to minimize requests
- Be respectful of the target server's resources
- Do not use the proxy for high-volume production traffic

### Reliability
- The proxy is provided as-is without guarantees of uptime
- For production applications, consider running your own proxy or accessing APIs directly
- Monitor for changes to the proxy endpoint or availability
- Implement proper error handling in your applications

### Legal and Ethical Use
- Ensure you have the right to access the resources you're proxying
- Respect the terms of service of the target APIs
- Do not use the proxy to circumvent access controls or violate policies
- Be mindful of copyright and data usage restrictions

---

## Common Use Case: Transit Data

One common use case for this proxy is accessing transit data APIs. For example:

**Car Jaune (Réunion Island) Transit Feed:**
```
https://gtfs-proxy.sys-dev-run.re/proxy/pysae.com/api/v2/groups/car-jaune/gtfs/pub
```

This provides public transit feed data for the Car Jaune bus network in Réunion Island.

---

## Troubleshooting

### Request Fails with 404
- Verify the target URL is correct
- Ensure you've removed the `https://` prefix
- Check that the target server is accessible

### Request Fails with 500
- The target server may be down or unreachable
- The target server may have blocked the proxy's IP address
- Try accessing the URL directly to verify it works

### CORS Errors
- Ensure you're using the proxy URL, not the direct URL
- Check browser console for specific error messages
- Verify the proxy is adding CORS headers correctly

---

## Contact

For issues or questions about the proxy service, contact the operator at sys-dev-run.re.
