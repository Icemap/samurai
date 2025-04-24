from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pydantic import computed_field
from urllib.parse import quote
from pydantic import MySQLDsn
from pydantic_core import MultiHostUrl

load_dotenv()

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 5001

    # Database configuration

    DB_HOST: str
    DB_PORT: int
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_DATABASE: str
    DB_SSL: bool = True

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    AFTER_LOGIN_REDIRECT_URI: str

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> MySQLDsn:
        return MultiHostUrl.build(
            scheme="mysql+pymysql",
            username=self.DB_USERNAME,
            # TODO: remove quote after following issue is fixed:
            # https://github.com/pydantic/pydantic/issues/8061
            password=quote(self.DB_PASSWORD),
            host=self.DB_HOST,
            port=self.DB_PORT,
            path=self.DB_DATABASE,
            query="ssl_verify_cert=true&ssl_verify_identity=true"
            if self.DB_SSL
            else None,
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

settings = Settings()