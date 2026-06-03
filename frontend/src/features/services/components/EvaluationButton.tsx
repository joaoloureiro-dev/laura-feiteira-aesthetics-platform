import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../../../components/ui/Button"

type EvaluationButtonProps = {
    serviceSlug: string
}

/**
 * EvaluationButton lets the client choose how they want to start:
 * - online evaluation by video call;
 * - in-person evaluation at the clinic.
 *
 * Important business rule:
 * Evaluations are real appointments too.
 * Later, when the booking flow is connected to the backend,
 * choosing one of these options will reserve an availability slot
 * and close that slot in the calendar.
 */
export function EvaluationButton({ serviceSlug }: EvaluationButtonProps) {
    const [isChoosingEvaluationType, setIsChoosingEvaluationType] = useState(false)
    const navigate = useNavigate()

    function handleEvaluationSelection(
        appointmentType: "ONLINE_EVALUATION" | "IN_PERSON_EVALUATION",
    ) {
        navigate(`/booking?service=${serviceSlug}&appointmentType=${appointmentType}`)
    }

    if (!isChoosingEvaluationType) {
        return (
            <Button
                type="button"
                className="mt-6 w-full"
                onClick={() => setIsChoosingEvaluationType(true)}
            >
                Faça já a sua avaliação
            </Button>
        )
    }

    return (
        <div className="mt-6 rounded-3xl border border-brand-gold/10 bg-brand-ivory p-4">
            <p className="text-sm font-semibold text-brand-charcoal">
                Escolha o tipo de avaliação
            </p>

            <p className="mt-2 text-sm leading-6 text-brand-gray">
                A avaliação também ocupa uma vaga na agenda e ficará reservada após a
                confirmação da marcação.
            </p>

            <div className="mt-5 grid gap-3">
                <Button
                    type="button"
                    onClick={() => handleEvaluationSelection("ONLINE_EVALUATION")}
                >
                    Avaliação por videochamada
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEvaluationSelection("IN_PERSON_EVALUATION")}
                >
                    Avaliação presencial
                </Button>
            </div>

            <button
                type="button"
                className="mt-4 text-sm font-semibold text-brand-dark-gold transition hover:text-brand-charcoal"
                onClick={() => setIsChoosingEvaluationType(false)}
            >
                Voltar
            </button>
        </div>
    )
}