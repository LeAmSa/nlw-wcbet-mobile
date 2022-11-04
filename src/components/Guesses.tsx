import { useState, useEffect } from "react";
import { useToast, FlatList, Box } from "native-base";

import { Game, GameProps } from "./Game";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

import { Loading } from "./Loading";

import { api } from "../services/api";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function getMatches() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/matches`);
      setMatches(response.data.matches);
      console.log(matches);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os jogos!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBetConfirm(matchId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/pools/${poolId}/matches/${matchId}/bets`, {
        homeTeamGoals: Number(firstTeamPoints),
        awayTeamGoals: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite salvo com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      getMatches();
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível enviar o palpite!",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    getMatches();
  }, [poolId]);

  return (
    // <FlatList
    //   data={matches}
    //   keyExtractor={(item) => item.id}
    //   renderItem={({ item }) => (
    //     <Game
    //       data={item}
    //       setFirstTeamPoints={setFirstTeamPoints}
    //       setSecondTeamPoints={setSecondTeamPoints}
    //       onGuessConfirm={() => {
    //         handleBetConfirm(item.id);
    //       }}
    //     />
    //   )}
    //   _contentContainerStyle={{ pb: 10 }}
    //   ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    // />
    <Box></Box>
  );
}
