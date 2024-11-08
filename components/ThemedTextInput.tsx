import { countries } from "@/constants/countries.constants";
import { sHeight } from "@/constants/dimensions.constant";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, {
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import DeviceCountry, { TYPE_TELEPHONY } from "react-native-device-country";
import { useTheme } from "@/hooks/useTheme.hook";
import { createNumberArray } from "@/utils/array.utils";
import {
  formatDateWithoutDay,
  getDaysInMonth,
  getYear18YearsAgo,
  monthsWithNames,
} from "@/utils/date.utils";
import Box, { BoxProps } from "./Box";
import Spacer from "./Spacer";
import ThemedButton, {
  ThemedButtonProps,
  ThemedIconButton,
} from "./ThemedButton";
import ThemedModal from "./ThemedModal";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import { moderateScale } from "react-native-size-matters";

export default function ThemedTextInput({
  wrapper,
  errorMessage,
  errors,
  leftSlot,
  leftSlotProps,
  rightSlot,
  rightSlotProps,
  dense,
  label,
  labelProps,
  size = "md",
  textInputRef,
  ...input
}: ThemedTextInputProps) {
  const theme = useTheme();

  const sizeStyles = getTextStyles(size);

  return (
    <Box>
      {label && (
        <>
          <ThemedText size={"sm"} fontWeight="light" {...labelProps}>
            {label}
          </ThemedText>
          <Spacer height={5} />
        </>
      )}
      <>
        <Box
          radius={10}
          borderWidth={1}
          direction="row"
          borderColor={theme.stroke}
          align="stretch"
          {...wrapper}
        >
          {leftSlot && (
            <Box
              pl={sizeStyles.paddingHorizontal / 2}
              align="center"
              justify="center"
              {...leftSlotProps}
            >
              {leftSlot}
            </Box>
          )}

          <TextInput
            placeholderTextColor={"gray"}
            {...input}
            ref={textInputRef}
            style={[
              input.style,
              {
                flex: 1,
                paddingLeft: leftSlot
                  ? sizeStyles.paddingHorizontal / 4
                  : sizeStyles.paddingHorizontal,
                paddingVertical:
                  Platform.OS === "ios"
                    ? sizeStyles.paddingVertical * 1.3
                    : sizeStyles.paddingVertical,
                fontFamily: "AnekDevanagari_400Regular",
                fontSize: sizeStyles.fontSize,
                color: theme.text,
              },
            ]}
          />
          {rightSlot && (
            <Box
              pr={sizeStyles.paddingHorizontal / 2}
              align="center"
              justify="center"
              {...rightSlotProps}
            >
              {rightSlot}
            </Box>
          )}
        </Box>

        {errorMessage && (
          <ThemedText color={theme.danger} size={12}>
            {errorMessage}
          </ThemedText>
        )}
        {errors && errorMessage?.length && (
          <Box block>
            {errors.map((err) => (
              <ThemedText key={err} color={theme.danger} size={12}>
                {err}
              </ThemedText>
            ))}
          </Box>
        )}
      </>
    </Box>
  );
}

export function ThemedEmailInput(props: ThemedTextInputProps) {
  const theme = useTheme();

  return (
    <ThemedTextInput
      autoCapitalize="none"
      placeholder="Email"
      keyboardType="email-address"
      leftSlot={<Feather name="mail" size={18} color={theme.text} />}
      leftSlotProps={{
        mx: 10,
      }}
      {...props}
    />
  );
}

export function ThemedPasswordInput(props: ThemedTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();

  return (
    <ThemedTextInput
      placeholder="Password"
      {...props}
      secureTextEntry={!showPassword}
      rightSlot={
        <Pressable onPress={() => setShowPassword((value) => !value)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={theme.text}
          />
        </Pressable>
      }
      leftSlot={<Feather name="lock" size={18} color={theme.text} />}
      leftSlotProps={{
        mx: 10,
      }}
    />
  );
}

export function ThemedSearchInput(props: ThemedSearchInputProps) {
  const [value, setValue] = useState(props.value || "");

  return (
    <ThemedTextInput
      placeholder="Search"
      value={value}
      {...props}
      onChangeText={(value) => {
        setValue(value);
        if (props.onChangeText) props.onChangeText(value);
      }}
      rightSlot={
        <ThemedIconButton
          icon={{ name: "x" }}
          onPress={() => {
            setValue("");
            props.onChangeText && props.onChangeText("");
            if (props.clear) props.clear();
          }}
        />
      }
    />
  );
}

export function ThemedPhoneNumberInput(props: ThemedPhoneNumberInputProps) {
  const [defaultCode, setDefaultCode] = useState<Country | null>(null);
  const [country, setCountry] = useState<Country>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (props.selectedPhone) {
      const selectedCountry = countries.find(
        (country) => country.phone_code === props.selectedPhone!.phoneCode
      );
      if (selectedCountry) setCountry(selectedCountry);
      setPhoneNumber(props.selectedPhone.cellphone);
    } else {
      setCountry(countries[0]);
    }

    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
      .then((countryCode) => {
        setCountry(
          countries.find((country) => country.short_code === countryCode?.code)
        );
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      <ThemedTextInput
        placeholder="Phone Number"
        keyboardType={"phone-pad"}
        value={phoneNumber}
        {...props}
        leftSlot={
          <ThemedButton type="text" onPress={() => setShowCountryPicker(true)}>
            {country && (
              <Box direction="row" align="center" gap={10}>
                <CountryFlag
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 12.5,
                  }}
                  isoCode={country.short_code}
                  size={14}
                />
                <ThemedText size={"sm"}>+{country.phone_code}</ThemedText>
                <Box height={"100%"} width={1} color={theme.border} />
              </Box>
            )}
          </ThemedButton>
        }
        leftSlotProps={{
          mx: 10,
          width: "auto",
        }}
        rightSlot={
          <ThemedIconButton
            icon={{ name: "chevron-down" }}
            onPress={() => setShowCountryPicker(true)}
          />
        }
        onChangeText={(value) => {
          setPhoneNumber(value);
          if (props.onInput) props.onInput(`${country!.phone_code}${value}`);
        }}
      />

      <CountryModal
        close={() => setShowCountryPicker(false)}
        onSelect={(value) => {
          setCountry(value);
          setShowCountryPicker(false);
        }}
        visible={showCountryPicker}
        disableCityFetch
      />
    </>
  );
}

export function ThemedCountryInput(props: ThemedCountryInputProps) {
  const [defaultCountry, setDefaultCountry] = useState<Country | null>(null);
  const [country, setCountry] = useState<Country | null>(
    props?.country || props?.country || null
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (props.country) {
      // dispatch(getCities({ country_id: props.country.id }));
      // TODO: Fetch cities
    }
    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
      .then((result) => {
        console.log(result);
        // {"code": "PT", "type": "telephony"}
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
        <ThemedTextInput
          placeholder="Country"
          value={country?.name}
          {...props}
          wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
          leftSlot={
            <Box align="center" justify="center">
              {country?.name ? (
                <CountryFlag
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 12.5,
                  }}
                  isoCode={country?.short_code}
                  size={14}
                />
              ) : (
                <></>
              )}
            </Box>
          }
          rightSlot={<ThemedIconButton icon={{ name: "chevron-down" }} />}
        />
      </TouchableOpacity>

      <CountryModal
        close={() => setShowCountryPicker(false)}
        onSelect={(value) => {
          setCountry(value);
          setShowCountryPicker(false);
          if (props.onInput) props.onInput(value);
        }}
        disableCityFetch={props.disableCityFetch || false}
        visible={showCountryPicker}
      />
    </>
  );
}

export type Country = (typeof countries)[0];

export function CountryModal({
  onSelect,
  close,
  disableCityFetch,
  visible,
}: {
  onSelect: (value: Country) => void;
  close: () => void;
  disableCityFetch: boolean;
  visible: boolean;
}) {
  const [filteredCountries, setFilteredCountries] =
    useState<Country[]>(countries);

  const theme = useTheme();

  function filterCountries(query: string) {
    const found = countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCountries(found);
  }

  function fetchCities(country: Country) {
    // TODO: Fetch cities
  }

  return (
    <ThemedModal
      position="bottom"
      visible={visible}
      transparent
      close={close}
      disableKeyboardAvoidance
      scrollable
    >
      <Box color={theme.background} gap={10} block height={sHeight - 100}>
        <ThemedTextInput
          placeholder="Search Country"
          leftSlot={<Feather name="search" size={16} color={theme.text} />}
          onChangeText={(value) => {
            filterCountries(value);
          }}
        />
        <Box block flex={1}>
          <FlatList
            data={filteredCountries}
            renderItem={({ item: country }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(country);
                    if (!disableCityFetch) {
                      fetchCities(country);
                    }
                  }}
                >
                  <Box key={country.id} direction="row" block pa={20} gap={10}>
                    <CountryFlag isoCode={country.short_code} size={20} />
                    <ThemedText>{country.name}</ThemedText>
                    <ThemedText style={{ opacity: 0.6 }}>
                      +{country.phone_code}
                    </ThemedText>
                  </Box>
                </TouchableOpacity>
              );
            }}
          />
        </Box>
      </Box>
    </ThemedModal>
  );
}

export interface ThemedCityInputExposed {
  reset: () => void;
}

// TODO: Add city Type
export type City = any;

export const ThemedCityInput = forwardRef(
  (props: ThemedCityInputProps, ref: Ref<ThemedCityInputExposed>) => {
    const theme = useTheme();

    const [city, setCity] = useState<City | null>(null);
    const [showCityPicker, setShowCityPicker] = useState(false);

    function reset() {
      setCity(null);
    }

    useImperativeHandle(ref, () => ({
      reset,
    }));

    return (
      <>
        <TouchableOpacity onPress={() => setShowCityPicker(true)}>
          <ThemedTextInput
            placeholder="City"
            value={city?.name || ""}
            {...props}
            wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
            rightSlot={<ThemedIconButton icon={{ name: "chevron-down" }} />}
          />
        </TouchableOpacity>
        <CityModal
          close={() => setShowCityPicker(false)}
          onSelect={(value) => {
            setCity(value);
            setShowCityPicker(false);
            if (props.onInput) props.onInput(value);
          }}
          visible={showCityPicker}
          selectedCityId={props.selectedCityId}
        />
      </>
    );
  }
);

export function CityModal({
  onSelect,
  close,
  visible,
  selectedCityId,
}: {
  onSelect: (value: City) => void;
  close: () => void;
  visible: boolean;
  selectedCityId?: string;
}) {
  const theme = useTheme();

  // const { cities } = useSelector((state: RootState) => state.auth);
  const cities: any[] = [];
  // TODO: Fetch cities

  const [filteredCities, setFilteredCities] = useState<typeof cities>(cities);

  function filterCities(query: string) {
    const found = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(found);
  }

  useEffect(() => {
    if (selectedCityId) {
      const selectedCity = cities.find(
        (city) => city.id.toString() === selectedCityId
      );
      if (selectedCity) onSelect(selectedCity);
    }
  }, []);

  useEffect(() => {
    setFilteredCities(cities);
    onSelect(cities[0]);
  }, [cities]);

  return (
    <ThemedModal position="bottom" visible={visible} transparent close={close}>
      <Box height={sHeight - 100} gap={10} block>
        <ThemedTextInput
          placeholder="Search City"
          leftSlot={<Feather name="search" size={16} color={theme.text} />}
          onChangeText={(value) => {
            filterCities(value);
          }}
        />
        <Box block flex={1}>
          <FlatList
            data={filteredCities}
            renderItem={({ item: city }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(city);
                  }}
                >
                  <Box key={city.id} direction="row" block pa={20} gap={10}>
                    <ThemedText>{city.name}</ThemedText>
                  </Box>
                </TouchableOpacity>
              );
            }}
          />
        </Box>
      </Box>
    </ThemedModal>
  );
}

export function ThemedDateInput(props: ThemedDateInputProps) {
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const theme = useTheme();

  return (
    <>
      <TouchableOpacity
        style={props?.pressableStyle}
        onPress={() => setShowDatePicker(true)}
      >
        <ThemedTextInput
          placeholder="Date"
          value={date}
          {...props}
          wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
          rightSlot={
            <Box pr={5} align="center" justify="center">
              <Feather name={"calendar"} size={20} color={theme.text} />
            </Box>
          }
        />
      </TouchableOpacity>

      <DatePickerModal
        visible={showDatePicker}
        close={() => setShowDatePicker(false)}
        onSelect={(value) => {
          if (props.onInput) props.onInput(value);
          setDate(formatDateWithoutDay(value));
          setShowDatePicker(false);
        }}
      />
    </>
  );
}

export function DatePickerModal({
  onSelect,
  close,
  visible,
}: {
  onSelect: (value: Date) => void;
  close: () => void;
  visible: boolean;
}) {
  const theme = useTheme();

  const maxYear = new Date().getFullYear();
  const minimumYear = getYear18YearsAgo() - 80;
  const [year, setYear] = useState(minimumYear);

  const [month, setMonth] = useState<(typeof monthsWithNames)[0] | null>(null);

  const [day, setDay] = useState<number | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);

  const scrollNext = () => {
    setStep((curr) => curr + 1);
  };
  const scrollPrev = () => {
    setStep((curr) => curr - 1);
  };

  return (
    <ThemedModal
      visible={visible}
      transparent
      close={() => {
        close();
      }}
      position="bottom"
    >
      <Box gap={10}>
        <Box
          direction="row"
          align="center"
          justify="space-evenly"
          height={sHeight / 3}
        >
          <Box width={"25%"} height={"100%"} gap={10}>
            <ThemedText size={"xs"} align="center">
              Year
            </ThemedText>
            <FlatList
              data={createNumberArray(minimumYear, maxYear)
                .sort((a, b) => b - a)
                .map((year) => ({
                  id: year,
                  year,
                }))}
              renderItem={({ item }) => (
                <ThemedButton
                  key={item.id}
                  label={item.year.toString()}
                  type={item.year === year ? "secondary-outlined" : "surface"}
                  onPress={() => {
                    setYear(item.year);
                    scrollNext();
                  }}
                  size="xxs"
                />
              )}
              ItemSeparatorComponent={() => <Spacer height={10} />}
            />
          </Box>

          <Box width={"25%"} height={"100%"} gap={10}>
            <ThemedText size={"xs"} align="center">
              Month
            </ThemedText>
            <FlatList
              data={monthsWithNames}
              renderItem={({ item }) => (
                <ThemedButton
                  key={item.month}
                  label={item.name}
                  type={
                    month?.name === item.name ? "secondary-outlined" : "surface"
                  }
                  onPress={() => {
                    setMonth(item);
                    scrollNext();
                  }}
                  size="xxs"
                />
              )}
              ItemSeparatorComponent={() => <Spacer height={10} />}
            />
          </Box>

          <Box width={"25%"} height={"100%"} gap={10}>
            <ThemedText size={"xs"} align="center">
              Day
            </ThemedText>
            <FlatList
              data={getDaysInMonth(year, month?.month ?? 0)}
              renderItem={({ item }) => (
                <ThemedButton
                  key={item}
                  label={item}
                  type={day === item ? "secondary-outlined" : "surface"}
                  onPress={() => {
                    setDay(item);
                  }}
                  size="xxs"
                />
              )}
              ItemSeparatorComponent={() => <Spacer height={10} />}
            />
          </Box>
        </Box>
        <Box block px={30} pt={5}>
          <ThemedButton
            label={"Done"}
            block
            type="secondary"
            size="sm"
            onPress={() => {
              if (!day || !month || !year) return;
              let dateObj = new Date(year, month.month, day);
              onSelect(dateObj);
            }}
            disabled={!day || !month || !year}
          />
        </Box>
      </Box>
    </ThemedModal>
  );
}

export function ThemedSelectInput<T extends Obj[]>(
  props: ThemedSelectProps<T>
) {
  const [selectedOption, setSelectedOption] = useState<Record<string, any>>(
    props.selected as any
  );
  const [showOptionPicker, setShowOptionPicker] = useState(false);

  const theme = useTheme();

  const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
    props.options
  );

  function filterOptions(query: string) {
    const found = props.options.filter((option) =>
      option[props.labelProperty]
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredOptions(found);
  }

  return (
    <>
      <TouchableOpacity onPress={() => setShowOptionPicker(true)}>
        <ThemedTextInput
          placeholder="Select"
          value={
            selectedOption
              ? selectedOption[props.labelProperty]?.toString()
              : "Select"
          }
          {...props}
          wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
          rightSlot={
            <ThemedIconButton
              icon={{ name: "chevron-down" }}
              onPress={() => setShowOptionPicker(true)}
            />
          }
        />
      </TouchableOpacity>

      <ThemedModal
        position="bottom"
        visible={showOptionPicker}
        containerProps={{
          height: Math.min(props.options.length * 60, sHeight - 100),
        }}
        close={() => setShowOptionPicker(false)}
        title={props.label || "Select"}
      >
        {props.enableSearch && (
          <ThemedTextInput
            placeholder="Search"
            leftSlot={<Feather name="search" size={16} color={theme.text} />}
            onChangeText={(value) => {
              filterOptions(value);
            }}
          />
        )}
        <FlatList
          data={filteredOptions}
          renderItem={({ item: option }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (props.onInput) props.onInput(option);
                  setSelectedOption(option);
                  setShowOptionPicker(false);
                }}
              >
                <Box
                  key={option[props.labelProperty]}
                  direction="row"
                  block
                  pa={10}
                  gap={10}
                >
                  <ThemedText>{option[props.labelProperty]}</ThemedText>
                </Box>
              </TouchableOpacity>
            );
          }}
        />
      </ThemedModal>
    </>
  );
}
export function ThemedOptionsPicker<T extends Obj[]>(
  props: ThemedOptionsPickerProps<T>
) {
  const [selectedOption, setSelectedOption] = useState<
    Record<string, any> | null | undefined
  >(props.selected as any);
  const [showOptionPicker, setShowOptionPicker] = useState(false);

  const theme = useTheme();

  const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
    props.options
  );

  function filterOptions(query: string) {
    const found = props.options.filter((option) =>
      option[props.labelProperty]
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredOptions(found);
  }

  useEffect(() => {
    setSelectedOption(props.selected);
    filterOptions("");
  }, [props.selected]);

  return (
    <>
      <ThemedButton
        {...props}
        label={
          selectedOption
            ? selectedOption[props.labelProperty].toString()
            : props.label
            ? props.label
            : "Select"
        }
        icon={{ name: "chevron-down", position: "append" }}
        onPress={() => setShowOptionPicker(true)}
        type={selectedOption ? "secondary" : "surface"}
      />

      <ThemedModal
        position="bottom"
        visible={showOptionPicker}
        containerProps={{
          height: Math.min(props.options.length * 50, sHeight - 120),
          radiusTop: 20,
          pa: 10,
          pb: 0,
        }}
        close={() => setShowOptionPicker(false)}
        title={`Select ${props.label}`}
      >
        {props.enableSearch && (
          <ThemedTextInput
            placeholder="Search"
            leftSlot={<Feather name="search" size={16} color={theme.text} />}
            onChangeText={(value) => {
              filterOptions(value);
            }}
          />
        )}
        <FlatList
          data={filteredOptions}
          renderItem={({ item: option }) => {
            return (
              <Box align="flex-start" key={option[props.labelProperty]} block>
                <ThemedButton
                  label={option[props.labelProperty]}
                  type={selectedOption === option ? "secondary" : "text"}
                  size="sm"
                  onPress={() => {
                    if (props.onInput) props.onInput(option);
                    setSelectedOption(option);
                    setShowOptionPicker(false);
                  }}
                  width={"100%"}
                  wrapperProps={{ justify: "flex-start" }}
                  radius={15}
                />
              </Box>
            );
          }}
        />
      </ThemedModal>
    </>
  );
}

export function ThemedOTPInput(
  props: ThemedTextInputProps & {
    otpLength: number;
    boxProps?: BoxProps;
    onInput?: (value: string) => void;
    onComplete?: (value: string) => void;
  }
) {
  const [otp, setOtp] = useState<string[]>([]);

  const theme = useTheme();

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const [currentInput, setCurrentInput] = useState(0);

  const handleInput = (value: string, index: number) => {
    console.log({ value, index });
    setCurrentInput(index);

    setOtp((current) => {
      const otpCopy = [...current];
      otpCopy[index] = value;
      props.onInput && props.onInput(otpCopy.join(""));

      if (otpCopy.join("").length === props.otpLength) {
        Keyboard.dismiss();
      }

      return otpCopy;
    });
    if (value.length === 1 && index < props.otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const clipboardListener = Clipboard.addClipboardListener(({ content }) => {
      if (content.length === props.otpLength) {
        setOtp(content.split(""));
        props.onInput && props.onInput(content);
        Keyboard.dismiss();
      }
    });

    return () => {
      Clipboard.removeClipboardListener(clipboardListener);
    };
  }, []);

  return (
    <>
      <Box direction="row" justify="space-between" {...props.boxProps}>
        {[...Array(props.otpLength)].map((_, index) => (
          <ThemedTextInput
            key={index}
            keyboardType="number-pad"
            maxLength={1}
            size="lg"
            style={{
              fontSize: moderateScale(20),
              padding: 0,
              height: moderateScale(50),
              width: moderateScale(50),
              paddingHorizontal: 20,
              color: theme.primary,
            }}
            wrapper={{
              borderColor:
                currentInput === index ? theme.primary : theme.stroke,
              radius: currentInput === index ? 15 : 10,
            }}
            value={otp[index]}
            onChangeText={(value) => handleInput(value, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                handleInput("", index);
              }
            }}
            textInputRef={(ref) => (inputRefs.current[index] = ref!)}
            onFocus={() => {
              setCurrentInput(index);
            }}
          />
        ))}
      </Box>
    </>
  );
}

type _BoxProps = Omit<BoxProps, "children">;

interface SlotProps extends _BoxProps {
  spacing?: number;
}

interface ThemedTextInputProps extends TextInputProps {
  wrapper?: Omit<BoxProps, "children">;
  errorMessage?: string | null | undefined;
  errors?: string[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  leftSlotProps?: SlotProps;
  rightSlotProps?: SlotProps;
  label?: string;
  labelProps?: ThemedTextProps;
  dense?: boolean;
  size?: InputSize;
  textInputRef?: Ref<TextInput>;
}

interface ThemedPhoneNumberInputProps extends ThemedTextInputProps {
  onInput?: (value: string) => void;
  selectedPhone?: {
    phoneCode: string;
    cellphone: string;
  };
}

interface ThemedSearchInputProps extends ThemedTextInputProps {
  onInput?: (value: string) => void;
  clear?: () => void;
}

interface ThemedCountryInputProps extends ThemedTextInputProps {
  onInput?: (value: Country) => void;
  country?: Country;
  disableCityFetch?: boolean;
}

interface ThemedCityInputProps extends ThemedTextInputProps {
  onInput?: (value: City) => void;
  selectedCityId?: string;
}

interface ThemedDateInputProps extends ThemedTextInputProps {
  onInput?: (value: Date) => void;
  pressableStyle?: ViewStyle;
}

type Obj = { [key: string]: any }; // Define a general object type

type KeysUnion<T extends Obj[]> = T extends Array<infer U> ? keyof U : never; // Extract keys union from array of objects

interface ThemedSelectProps<T extends Obj[]> extends ThemedTextInputProps {
  options: T;
  labelProperty: KeysUnion<T>;
  enableSearch?: boolean;
  selected?: T[number];
  onInput?: (selectedOption: T[number]) => void;
}

interface ThemedOptionsPickerProps<T extends Obj[]> extends ThemedButtonProps {
  options: T;
  labelProperty: KeysUnion<T>;
  enableSearch?: boolean;
  selected?: T[number] | null;
  onInput?: (selectedOption: T[number]) => void;
}

// interface ThemedSelectProps extends Props<T> {
// 	onInput: (value: Record<string, any>) => void;
// 	options: Record<string, any>[];
// 	labelProperty: string;
// 	enableSearch?: boolean;
// 	selected?: Record<string, any>;
// }

type InputSize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl";

interface InputStyles {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
}

const textSizes = [
  { size: "xxxs", value: 8 },
  { size: "xxs", value: 10 },
  { size: "xs", value: 12 },
  { size: "sm", value: 14 },
  { size: "md", value: 16 },
  { size: "lg", value: 18 },
  { size: "xl", value: 20 },
  { size: "xxl", value: 24 },
  { size: "xxxl", value: 28 },
];

const getTextStyles = (size: InputSize): InputStyles => {
  let styles: InputStyles = {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
  };

  switch (size) {
    case "xxxs":
      styles = {
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 6,
      };
      break;
    case "xxs":
      styles = {
        paddingVertical: 2,
        paddingHorizontal: 12,
        fontSize: 8,
      };
      break;
    case "xs":
      styles = {
        paddingVertical: 0,
        paddingHorizontal: 14,
        fontSize: 10,
      };
      break;
    case "sm":
      styles = {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 12,
      };
      break;
    case "md":
      styles = {
        paddingVertical: 14,
        paddingHorizontal: 18,
        fontSize: 14,
      };
      break;
    case "lg":
      styles = {
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
      };
      break;
    case "xl":
      styles = {
        paddingVertical: 18,
        paddingHorizontal: 22,
        fontSize: 18,
      };
      break;
    case "xxl":
      styles = {
        paddingVertical: 20,
        paddingHorizontal: 24,
        fontSize: 20,
      };
      break;
    case "xxxl":
      styles = {
        paddingVertical: 22,
        paddingHorizontal: 26,
        fontSize: 22,
      };
      break;
    default:
      // Default values already set
      break;
  }

  return styles;
};
