from rest_framework import serializers

from .models import League, Match, MatchPlayerStat, Player


class LeagueSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ["id", "name"]


class PlayerSerializer(serializers.ModelSerializer):
    leagues = LeagueSummarySerializer(many=True, read_only=True)
    # leagues = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=League.objects.all()
    # )

    class Meta:
        model = Player
        fields = "__all__"

    # def create(self, validated_data):
    #     leagues_data = validated_data.pop('leagues', [])
    #     player = Player.objects.create(**validated_data)
    #     player.leagues.set(leagues_data)
    #     return player


class LeagueSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = League
        fields = "__all__"


class MatchPlayerStatSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all())

    class Meta:
        model = MatchPlayerStat
        fields = ["player", "score"]


class MatchSerializer(serializers.ModelSerializer):
    player_stats = MatchPlayerStatSerializer(many=True)

    class Meta:
        model = Match
        fields = ['id', 'league', 'date', 'player_stats']

    def create(self, validated_data):
        player_stats_data = validated_data.pop("player_stats")
        match = Match.objects.create(**validated_data)
        for stat in player_stats_data:
            MatchPlayerStat.objects.create(match=match, **stat)
        return match

    def update(self, instance, validated_data):
        player_stats_data = validated_data.pop("player_stats", [])
        instance.league = validated_data.get("league", instance.league)
        instance.date = validated_data.get("date", instance.date)
        instance.save()

        if player_stats_data:
            instance.player_stats.all().delete()
            for stat in player_stats_data:
                MatchPlayerStat.objects.create(match=instance, **stat)

        return instance
