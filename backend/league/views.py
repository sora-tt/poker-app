from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum

from .models import League, Match, Player, MatchPlayerStat
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
    
    @action(detail=True, methods=['get'])
    def ranking(self, request, pk=None):
        league = self.get_object()
        stats = (
            MatchPlayerStat.objects
            .filter(match__league=league)
            .values('player__id', 'player__name')
            .annotate(total_score=Sum('score'))
            .order_by('-total_score')
        )
        return Response(stats)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return PlayerWriteSerializer
        return PlayerReadSerializer


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
