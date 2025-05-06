from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import League, Match, MatchPlayerStat, Player
from .serializers import (
    LeagueSerializer,
    MatchSerializer,
    PlayerReadSerializer,
    PlayerWriteSerializer,
)

# Create your views here.


class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer

    @action(detail=True, methods=["get"])
    def players(self, request, pk=None):
        league = self.get_object()
        players = league.players.all()
        serializer = PlayerReadSerializer(players, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def ranking(self, request, pk=None):
        league = self.get_object()
        stats = (
            MatchPlayerStat.objects.filter(match__league=league)
            .values("player__id", "player__name")
            .annotate(total_score=Sum("score"))
            .order_by("-total_score")
        )
        return Response(stats)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return PlayerWriteSerializer
        return PlayerReadSerializer

    # def perform_update(self, serializer):
    #     instance = serializer.save()
    #     leagues = self.request.data.get("leagues", None)
    #     if leagues is not None:
    #         instance.leagues.set(leagues)
    #         instance.save()


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["league"]
