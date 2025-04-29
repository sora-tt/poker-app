from django.urls import include, path
from rest_framework import routers

from .views import LeagueViewSet, PlayerViewSet, MatchViewSet

router = routers.DefaultRouter()
router.register(r"leagues", LeagueViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'matches', MatchViewSet)  # 👈 Matchのルーティングを追加！

urlpatterns = [
    path("", include(router.urls)),
]
