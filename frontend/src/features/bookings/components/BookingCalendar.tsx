import { useMemo, useState } from "react"

import type { AvailabilitySlot } from "../../services/types/services.types"

type BookingCalendarProps = {
    slots: AvailabilitySlot[]
    selectedDateKey: string
    onSelectDate: (dateKey: string) => void
}

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

function getDateKey(dateValue: string | Date) {
    const date =
        typeof dateValue === "string"
            ? new Date(dateValue)
            : dateValue

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

function getMonthLabel(date: Date) {
    return date.toLocaleDateString("pt-PT", {
        month: "long",
        year: "numeric",
    })
}

function getCalendarDays(currentMonth: Date) {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    /*
     * JavaScript:
     * domingo = 0
     * segunda = 1
     *
     * O nosso calendário começa à segunda-feira.
     */
    const leadingEmptyDays =
        firstDayOfMonth.getDay() === 0
            ? 6
            : firstDayOfMonth.getDay() - 1

    const days: Array<Date | null> = []

    for (let index = 0; index < leadingEmptyDays; index += 1) {
        days.push(null)
    }

    for (
        let day = 1;
        day <= lastDayOfMonth.getDate();
        day += 1
    ) {
        days.push(new Date(year, month, day))
    }

    while (days.length % 7 !== 0) {
        days.push(null)
    }

    return days
}

export function BookingCalendar({
    slots,
    selectedDateKey,
    onSelectDate,
}: BookingCalendarProps) {
    const firstAvailableDate = slots[0]
        ? new Date(slots[0].startsAt)
        : new Date()

    const [currentMonth, setCurrentMonth] = useState(
        new Date(
            firstAvailableDate.getFullYear(),
            firstAvailableDate.getMonth(),
            1,
        ),
    )

    const availableDates = useMemo(() => {
        return new Set(
            slots.map((slot) => getDateKey(slot.startsAt)),
        )
    }, [slots])

    const slotsCountByDate = useMemo(() => {
        return slots.reduce<Record<string, number>>(
            (accumulator, slot) => {
                const dateKey = getDateKey(slot.startsAt)

                accumulator[dateKey] =
                    (accumulator[dateKey] ?? 0) + 1

                return accumulator
            },
            {},
        )
    }, [slots])

    const calendarDays = useMemo(
        () => getCalendarDays(currentMonth),
        [currentMonth],
    )

    const todayKey = getDateKey(new Date())

    function goToPreviousMonth() {
        setCurrentMonth(
            (previousMonth) =>
                new Date(
                    previousMonth.getFullYear(),
                    previousMonth.getMonth() - 1,
                    1,
                ),
        )
    }

    function goToNextMonth() {
        setCurrentMonth(
            (previousMonth) =>
                new Date(
                    previousMonth.getFullYear(),
                    previousMonth.getMonth() + 1,
                    1,
                ),
        )
    }

    return (
        <div className="rounded-3xl border border-brand-gold/10 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={goToPreviousMonth}
                    aria-label="Mês anterior"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/20 text-xl text-brand-charcoal transition hover:bg-brand-ivory"
                >
                    ‹
                </button>

                <h4 className="text-lg font-semibold capitalize text-brand-charcoal">
                    {getMonthLabel(currentMonth)}
                </h4>

                <button
                    type="button"
                    onClick={goToNextMonth}
                    aria-label="Mês seguinte"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/20 text-xl text-brand-charcoal transition hover:bg-brand-ivory"
                >
                    ›
                </button>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                {WEEK_DAYS.map((weekDay) => (
                    <div
                        key={weekDay}
                        className="py-2 text-xs font-semibold uppercase tracking-wide text-brand-gray"
                    >
                        {weekDay}
                    </div>
                ))}

                {calendarDays.map((date, index) => {
                    if (!date) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="aspect-square"
                            />
                        )
                    }

                    const dateKey = getDateKey(date)
                    const hasAvailability =
                        availableDates.has(dateKey)
                    const isSelected =
                        selectedDateKey === dateKey
                    const isToday = todayKey === dateKey
                    const isPast = dateKey < todayKey
                    const isDisabled =
                        !hasAvailability || isPast

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            disabled={isDisabled}
                            onClick={() =>
                                onSelectDate(dateKey)
                            }
                            className={`relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-2xl border text-sm transition ${isSelected
                                    ? "border-brand-gold bg-brand-gold font-semibold text-white shadow-sm"
                                    : hasAvailability &&
                                        !isPast
                                        ? "border-brand-gold/30 bg-brand-ivory font-semibold text-brand-charcoal hover:border-brand-gold hover:bg-brand-gold/10"
                                        : "cursor-not-allowed border-transparent bg-transparent text-brand-gray/35"
                                }`}
                        >
                            <span>{date.getDate()}</span>

                            {hasAvailability && !isPast ? (
                                <span
                                    className={`mt-1 text-[10px] ${isSelected
                                            ? "text-white/90"
                                            : "text-brand-dark-gold"
                                        }`}
                                >
                                    {slotsCountByDate[dateKey]}{" "}
                                    {slotsCountByDate[dateKey] === 1
                                        ? "vaga"
                                        : "vagas"}
                                </span>
                            ) : null}

                            {isToday ? (
                                <span
                                    className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected
                                            ? "bg-white"
                                            : "bg-brand-gold"
                                        }`}
                                />
                            ) : null}
                        </button>
                    )
                })}
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-brand-gray">
                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-brand-gold/30 bg-brand-ivory" />
                    Com vagas
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-brand-gold" />
                    Selecionado
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-brand-gray/20" />
                    Indisponível
                </div>
            </div>
        </div>
    )
}