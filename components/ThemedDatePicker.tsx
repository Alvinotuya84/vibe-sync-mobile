import { sHeight } from "@/constants/dimensions.constant";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useTheme } from "@/hooks/useTheme.hook";
import { createNumberArray } from "@/utils/array.utils";
import {
	formatDateWithoutDay,
	getDaysInMonth,
	monthsWithNames,
} from "@/utils/date.utils";
import Box from "./Box";
import Spacer from "./Spacer";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import ThemedModal from "./ThemedModal";
import ThemedText from "./ThemedText";

export function ThemedDatePicker({
	buttonProps,
	onPick,
	onRangePick,
	type = "date",
	maxDate,
	minDate,
}: {
	buttonProps?: ThemedButtonProps;
	type?: "date" | "daterange";
	onPick?: (value: Date) => void;
	onRangePick?: ({ start, end }: { start: Date; end: Date }) => void;
	maxDate?: Date;
	minDate?: Date;
}) {
	const [date, setDate] = useState("");
	const [showDatePicker, setShowDatePicker] = useState(false);

	return (
		<>
			<ThemedButton
				onPress={() => setShowDatePicker(true)}
				type="secondary"
				icon={{ name: "calendar" }}
				{...buttonProps}
				label={date || buttonProps?.label || "Date"}
			/>

			{type === "daterange" && (
				<DateRangePickerModal
					visible={showDatePicker}
					close={() => setShowDatePicker(false)}
					onSelect={(value) => {
						onRangePick && onRangePick(value);
						setDate(
							`${formatDateWithoutDay(value.start)} - ${formatDateWithoutDay(
								value.end
							)}`
						);
						setShowDatePicker(false);
					}}
				/>
			)}
			{type === "date" && (
				<DatePickerModal
					visible={showDatePicker}
					close={() => setShowDatePicker(false)}
					onSelect={(value) => {
						onPick && onPick(value);
						setDate(formatDateWithoutDay(value));
						setShowDatePicker(false);
					}}
				/>
			)}
		</>
	);
}

export function DatePickerModal({
	onSelect,
	close,
	visible,
	minDate,
	maxDate,
}: {
	onSelect: (value: Date) => void;
	close: () => void;
	visible: boolean;
	minDate?: Date;
	maxDate?: Date;
}) {
	const today = new Date();

	const [year, setYear] = useState<number>(today.getFullYear());

	const [month, setMonth] = useState<(typeof monthsWithNames)[0]>({
		month: today.getMonth(),
		name: monthsWithNames[today.getMonth()].name,
	});

	const [day, setDay] = useState<number>(1);

	const [years, setYears] = useState<
		{
			id: number;
			year: number;
		}[]
	>([]);
	function generateYears() {
		console.log("Generating years...");
		// minimum year should be 90 years ago
		let min = minDate?.getFullYear() ?? new Date().getFullYear() - 90;
		let max = maxDate?.getFullYear() ?? new Date().getFullYear();
		const _years = createNumberArray(min, max)
			.sort((a, b) => b - a)
			.map((year) => ({
				id: year,
				year,
			}));

		setYears(_years);
	}

	useEffect(() => {
		generateYears();
	}, []);
	return (
		<ThemedModal
			visible={visible}
			transparent
			close={close}
			position="bottom"
			containerProps={{
				pb: 5,
			}}
		>
			<Box>
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
							data={years}
							renderItem={({ item }) => (
								<ThemedButton
									key={item.id}
									label={item.year.toString()}
									type={item.year === year ? "secondary" : "surface"}
									onPress={() => {
										setYear(item.year);
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
									type={month?.name === item.name ? "secondary" : "surface"}
									onPress={() => {
										setMonth(item);
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
									type={day === item ? "secondary" : "surface"}
									onPress={() => {
										setDay(item);
									}}
									size="xxs"
								/>
							)}
							ItemSeparatorComponent={() => <Spacer height={10} />}
						/>
					</Box>
					B
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
					/>
				</Box>
			</Box>
		</ThemedModal>
	);
}

export function DateRangePickerModal({
	onSelect,
	close,
	visible,
	minDate,
	maxDate,
}: {
	onSelect: ({ start, end }: { start: Date; end: Date }) => void;
	close: () => void;
	visible: boolean;
	minDate?: Date;
	maxDate?: Date;
}) {
	const theme = useTheme();

	const today = new Date();

	const [startYear, setStartYear] = useState<number | null>(null);
	const [startMonth, setStartMonth] = useState<
		(typeof monthsWithNames)[0] | null
	>(null);
	const [startDay, setStartDay] = useState<number | null>(null);

	const [endYear, setEndYear] = useState<number | null>(null);
	const [endMonth, setEndMonth] = useState<(typeof monthsWithNames)[0] | null>(
		null
	);
	const [endDay, setEndDay] = useState<number | null>(null);

	const [years, setYears] = useState<
		{
			id: number;
			year: number;
		}[]
	>([]);
	function generateYears() {
		console.log("Generating years...");
		// minimum year should be 90 years ago
		let min = minDate?.getFullYear() ?? new Date().getFullYear() - 50;
		let max = maxDate?.getFullYear() ?? new Date().getFullYear();
		const _years = createNumberArray(min, max)
			.sort((a, b) => b - a)
			.map((year) => ({
				id: year,
				year,
			}));

		setYears(_years);
	}

	useEffect(() => {
		generateYears();
	}, []);

	return (
		<ThemedModal
			visible={visible}
			transparent
			close={close}
			position="bottom"
			containerProps={{
				pb: 5,
				pt: 5,
				gap: 10,
				align: "center",
			}}
			title="Select Date Range"
		>
			{startDay && startMonth && startYear && endDay && endMonth && endYear && (
				<Box px={10} py={5} radius={20} color={theme.surface}>
					<ThemedText align="center" size={"xs"} fontWeight="semibold">
						{`${formatDateWithoutDay(
							new Date(startYear, startMonth.month, startDay)
						)} - ${formatDateWithoutDay(
							new Date(endYear, endMonth.month, endDay)
						)}`}
					</ThemedText>
				</Box>
			)}
			<Box align="center" gap={20} pb={10}>
				<Box block gap={10} height={40 * 3}>
					<FlatList
						data={years}
						horizontal
						renderItem={({ item }) => (
							<ThemedButton
								key={item.id}
								label={item.year.toString()}
								type={item.year === startYear ? "secondary" : "surface"}
								onPress={() => {
									setStartYear(item.year);
								}}
								size="xxs"
							/>
						)}
						ItemSeparatorComponent={() => <Spacer width={10} />}
					/>
					<FlatList
						horizontal
						data={monthsWithNames}
						renderItem={({ item }) => (
							<ThemedButton
								key={item.month}
								label={item.name}
								type={startMonth?.name === item.name ? "secondary" : "surface"}
								onPress={() => {
									setStartMonth(item);
								}}
								size="xxs"
							/>
						)}
						ItemSeparatorComponent={() => <Spacer width={10} />}
					/>

					<FlatList
						horizontal
						data={getDaysInMonth(
							startYear ?? new Date().getFullYear(),
							startMonth?.month ?? 0
						)}
						renderItem={({ item }) => (
							<ThemedButton
								key={item}
								label={item}
								type={startDay === item ? "secondary" : "surface"}
								onPress={() => {
									setStartDay(item);
								}}
								size="xxs"
							/>
						)}
						ItemSeparatorComponent={() => <Spacer width={10} />}
					/>
				</Box>

				<Box
					height={80}
					width={30}
					radius={20}
					color={theme.surface}
					align="center"
					justify="space-between"
					py={5}
					borderWidth={2}
					borderColor={theme.border}
				>
					<Box width={20} height={20} color={theme.border} radius={20} />
					<Box width={20} height={20} color={theme.border} radius={20} />
				</Box>

				<Box block justify="space-between" gap={10} height={40 * 3}>
					<FlatList
						data={years}
						horizontal
						renderItem={({ item }) => (
							<ThemedButton
								key={item.id}
								label={item.year.toString()}
								type={item.year === endYear ? "secondary" : "surface"}
								onPress={() => {
									setEndYear(item.year);
								}}
								size="xxs"
							/>
						)}
						ItemSeparatorComponent={() => <Spacer width={10} />}
					/>
					<FlatList
						horizontal
						data={monthsWithNames}
						renderItem={({ item }) => (
							<ThemedButton
								key={item.month}
								label={item.name}
								type={endMonth?.name === item.name ? "secondary" : "surface"}
								onPress={() => {
									setEndMonth(item);
								}}
								size="xxs"
							/>
						)}
						ItemSeparatorComponent={() => <Spacer width={10} />}
					/>
					<FlatList
						horizontal
						data={getDaysInMonth(
							endYear ?? new Date().getFullYear(),
							endMonth?.month ?? 0
						)}
						renderItem={({ item }) => (
							<ThemedButton
								key={item}
								label={item}
								type={endDay === item ? "secondary" : "surface"}
								onPress={() => {
									setEndDay(item);
								}}
								size="xxs"
							/>
						)}
						ItemSeparatorComponent={() => <Spacer width={10} />}
					/>
				</Box>

				<ThemedButton
					label={"Done"}
					type="surface"
					px={60}
					disabled={
						!startDay ||
						!startMonth ||
						!startYear ||
						!endDay ||
						!endMonth ||
						!endYear
					}
					size="xs"
					onPress={() => {
						if (!startDay || !startMonth || !startYear) return;
						if (!endDay || !endMonth || !endYear) return;
						let startDate = new Date(startYear, startMonth.month, startDay);
						let endDate = new Date(endYear, endMonth.month, endDay);
						onSelect({ start: startDate, end: endDate });
					}}
				/>
			</Box>
		</ThemedModal>
	);
}
