import { HStack } from "native-base";
import CountryFlag from "react-native-country-flag";

import { GuessProps } from "./Game";

import { Input } from "./Input";

interface Props {
  code: string;
  homeTeamGoals?: number;
  awayTeamGoals?: number;
  position: "left" | "right";
  onChangeText: (value: string) => void;
}

export function Team({
  code,
  position,
  homeTeamGoals,
  awayTeamGoals,
  onChangeText,
}: Props) {
  return (
    <HStack alignItems="center">
      {position === "left" && (
        <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />
      )}

      <Input
        w={10}
        h={9}
        textAlign="center"
        fontSize="xs"
        keyboardType="numeric"
        onChangeText={onChangeText}
        defaultValue={
          homeTeamGoals || awayTeamGoals
            ? position === "right"
              ? String(homeTeamGoals)
              : String(awayTeamGoals)
            : ""
        }
        isDisabled={homeTeamGoals || awayTeamGoals}
      />

      {position === "right" && (
        <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />
      )}
    </HStack>
  );
}
