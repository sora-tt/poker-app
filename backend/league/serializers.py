from rest_framework import serializers

from .models import League, Match, Player


class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = "__all__"


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = "__all__"


class MatchSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)  # プレイヤーたちも出力する

    class Meta:
        model = Match
        fields = "__all__"
