# WordPress API setup

WordPress does not use a generic API key by default for the core REST API.

For this repo, use:

- a WordPress user account
- an Application Password created for that user

This connector is intended for staging blog drafts that a human reviews before publishing.

For blog staging quality, credential setup is only half the job. Source-file choice matters:

- prefer `docx` over `pdf` when both exist
- use `pdf` mainly as a visual reference or fallback source
- use `txt` only when richer source formats are unavailable

## Where to create credentials

In the WordPress admin UI:

1. open `https://<your-site>/wp-admin/`
2. in the left nav, go to `Users`
3. click `Profile` for your own user, or `All Users` and then click your username
4. scroll down to the `Application Passwords` section
5. enter a name for this integration, for example `blog-agent`
6. click `Add New Application Password`

WordPress will show the password once. Copy it immediately.

This is the closest thing WordPress has to an API key for the core REST API.

Use one Application Password per integration instead of reusing one across tools.

## Required values

Store these in `.env`:

```bash
WORDPRESS_BASE_URL=https://YOUR-SITE.example
WORDPRESS_USERNAME=<your-wordpress-username>
WORDPRESS_APPLICATION_PASSWORD="<the generated application password>"
```

Do not paste the Application Password unquoted into `.env` if it contains spaces.

This repo commonly loads env vars with:

```bash
set -a; source .env; set +a
```

If the password is unquoted, shell parsing will split it into separate tokens and auth will fail.

## Auth check

```bash
set -a; source .env; set +a
curl -fsS \
  -u "$WORDPRESS_USERNAME:$WORDPRESS_APPLICATION_PASSWORD" \
  "$WORDPRESS_BASE_URL/wp-json/wp/v2/users/me"
```

If this returns your user record, the connector is set up correctly.

If `source .env` prints `command not found`, the WordPress password line is almost certainly unquoted.

## Practical notes

- HTTPS is required
- permissions match the user account
- an `Administrator` can usually manage posts, pages, media, categories, and tags
- some security plugins or reverse proxies can block Basic Auth; if auth fails unexpectedly, check site security middleware first

## REST API endpoints you will likely use

- `GET /wp-json/wp/v2/users/me`
- `POST /wp-json/wp/v2/posts`
- `POST /wp-json/wp/v2/posts/<id>`
- `POST /wp-json/wp/v2/media`
- `GET /wp-json/wp/v2/categories`
- `GET /wp-json/wp/v2/tags`

## WP-CLI

WP-CLI exists, but it is only useful when you have shell access to the WordPress host.

Examples:

```bash
wp post create --post_type=post --post_status=draft --post_title="Test"
wp media import image.png --porcelain
```

Use WP-CLI only when the user explicitly has SSH or terminal access to the server where WordPress runs.
