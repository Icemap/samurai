import json
from urllib.parse import urlencode
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse
from app.config import settings

router = APIRouter()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    access_token_url="https://oauth2.googleapis.com/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    client_kwargs={
        "scope": "email profile",
    },
)

@router.route('/login')
async def login(request: Request):
    # absolute url for callback
    # we will define it below
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.route('/auth/google')
async def auth_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    resp = await oauth.google.get('userinfo', token=token)
    user = resp.json()

    if user:
        request.session['user'] = dict(user)
        
        # Prepare user data as query parameters
        user_params = {
            "user_id": user.get("id", ""),
            "user_email": user.get("email", ""),
            "user_name": user.get("name", ""),
            "user_picture": user.get("picture", ""),
            "user_given_name": user.get("given_name", ""),
            "user_family_name": user.get("family_name", ""),
            "user_hd": user.get("hd", ""),
            "user_verified_email": str(user.get("verified_email", False)).lower()
        }
        
        # Filter out any parameters with empty values, if desired
        user_params_filtered = {k: v for k, v in user_params.items() if v}
        
        # Construct the redirect URL with query parameters
        redirect_url = f"{settings.AFTER_LOGIN_REDIRECT_URI}?{urlencode(user_params_filtered)}"
        
        print(redirect_url)
        
        return RedirectResponse(url=redirect_url)
        
    return JSONResponse(content={"error": "Authentication failed"})