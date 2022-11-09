import { TouchableOpacity } from "react-native";
import { HStack, Text, useTheme } from "native-base";

import { CaretLeft, CaretRight } from "phosphor-react-native";

import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

interface DateSelectProps {
  currentDate: dayjs.Dayjs;
  setCurrentDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}

export function DateSelect({ currentDate, setCurrentDate }: DateSelectProps) {
  const { colors, sizes } = useTheme();

  const cantGoToPrevDate = currentDate.date() === 20;
  const cantGoToNextDate = currentDate.date() === 2;

  function goToPrevDay() {
    const prevDay = currentDate.subtract(1, "day");
    setCurrentDate(prevDay);
  }

  function goToNextDay() {
    const nextDay = currentDate.add(1, "day");
    setCurrentDate(nextDay);
  }

  return (
    <HStack
      w="full"
      alignItems="center"
      justifyContent="space-between"
      px={5}
      pb={5}
    >
      <TouchableOpacity onPress={goToPrevDay} disabled={cantGoToPrevDate}>
        <CaretLeft
          color={cantGoToPrevDate ? colors.gray[300] : colors.yellow[500]}
          size={sizes[5]}
        />
      </TouchableOpacity>

      <Text color="white" fontFamily="medium" fontSize="sm">
        {currentDate.locale(ptBR).format("DD [de] MMMM")}
      </Text>

      <TouchableOpacity onPress={goToNextDay} disabled={cantGoToNextDate}>
        <CaretRight
          color={cantGoToNextDate ? colors.gray[300] : colors.yellow[500]}
          size={sizes[5]}
        />
      </TouchableOpacity>
    </HStack>
  );
}
