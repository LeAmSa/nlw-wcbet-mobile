import { useState, useEffect, useRef } from "react";
import { useToast, FlatList, VStack } from "native-base";

import { Game, GameProps } from "./Game";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

import { Loading } from "./Loading";

import { api } from "../services/api";
import { DateSelect } from "./DateSelect";

import dayjs from "dayjs";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const initialRender = useRef(true);

  const [isLoading, setIsLoading] = useState(true);

  const [matches, setMatches] = useState<GameProps[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<GameProps[]>([]);

  const [homeTeamGoals, setHomeTeamGoals] = useState("");
  const [awayTeamGoals, setAwayTeamGoals] = useState("");

  const toast = useToast();

  const [currentDate, setCurrentDate] = useState(dayjs("2022-11-20"));

  //format("YYYY-MM-DDTHH:mm:ss[Z]")

  async function getMatches() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/matches`);

      const allMatches = await response.data.matches;

      setMatches(allMatches);
      // console.log("All matches => ", allMatches);

      const filtered = allMatches.filter(
        (match) => match.date.split("T")[0] === currentDate.format("YYYY-MM-DD")
      );

      setFilteredMatches(filtered);
      // console.log("FILTERED =>", filtered);
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

  function getFilteredMatchesByCurrentDate() {
    const filteredMatchesByCurrentDate = matches.filter(
      (match) => match.date.split("T")[0] === currentDate.format("YYYY-MM-DD")
    );

    setFilteredMatches(filteredMatchesByCurrentDate);
  }

  async function handleBetConfirm(matchId: string) {
    try {
      if (!homeTeamGoals.trim() || !awayTeamGoals.trim()) {
        return toast.show({
          title: "Informe o placar!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/pools/${poolId}/matches/${matchId}/bets`, {
        homeTeamGoals: Number(homeTeamGoals),
        awayTeamGoals: Number(awayTeamGoals),
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
    initialRender.current
      ? (initialRender.current = false)
      : getFilteredMatchesByCurrentDate();
  }, [currentDate]);

  useEffect(() => {
    getMatches();
  }, []);

  return (
    <VStack flex={1}>
      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1}>
          <DateSelect
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <FlatList
            data={filteredMatches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Game
                data={item}
                setHomeTeamGoals={setHomeTeamGoals}
                setAwayTeamGoals={setAwayTeamGoals}
                onGuessConfirm={() => {
                  handleBetConfirm(item.id);
                }}
              />
            )}
            _contentContainerStyle={{ pb: 20 }}
            ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
          />
        </VStack>
      )}
    </VStack>
  );
}
