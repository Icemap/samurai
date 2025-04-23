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
    redirect_uri = request.url_for('auth_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.route('/auth/google')
async def auth_google(request: Request):
    token = await oauth.google.authorize_access_token(request)

    # 使用access_token获取用户信息
    resp = await oauth.google.get('userinfo', token=token)
    user = resp.json()

    if user:
        request.session['user'] = dict(user)
        return JSONResponse(content=user)
    return JSONResponse(content={"error": "Authentication failed"})