import { VStack, useToast, HStack } from "native-base";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Share } from "react-native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCardProps } from "../components/PoolCard";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { PoolHeader } from "../components/PoolHeader";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [optionSelected, setOptionSelected] = useState<"bets" | "ranking">(
    "bets"
  );

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast();

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    });
  }

  async function getPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);
      setPollDetails(response.data.pool);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os detalhes do bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPollDetails();
  }, [id]);

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails.title}
        handleCodeShare={handleCodeShare}
        showBackButton
        showShareButton
      />

      {pollDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails} />

          <HStack bgColor="gray.800" rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "bets"}
              onPress={() => setOptionSelected("bets")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>

          <Guesses poolId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pollDetails.code} />
      )}
    </VStack>
  );
}
