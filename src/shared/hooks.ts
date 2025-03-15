import { useState, useEffect } from "react"
import { PlanData, PlansData } from "./types"
import { addOneWeek, getWeekEnd, getWeekStart, subtractOneWeek } from "./utils"

/**
 * Creates a custom hook that stores a value in local storage.
 */
function useLocalStorage<T>(
	key: string,
	defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => getStoredValue(key, defaultValue))

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [value, key])

	return [value, setValue]
}

function getStoredValue<T>(key: string, defaultValue: T): T {
	try {
		const item = localStorage.getItem(key)
		return item ? JSON.parse(item) : defaultValue
	} catch (_) {
		return defaultValue
	}
}

export function usePlans() {
	const [plans, setPlans] = useLocalStorage<PlansData>("plansReact", {})

	function updatePlans(weekKey: string, updatedPlans: PlanData[]): void {
		const isEmpty = updatedPlans.length === 0
		if (isEmpty) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [weekKey]: _, ...rest } = plans
			setPlans(rest)
		} else {
			setPlans((plans) => ({ ...plans, [weekKey]: updatedPlans }))
		}
	}

	function updatePlan(
		id: string,
		weekKey: string,
		transform: (plan: PlanData) => Partial<PlanData>
	): void {
		const updatedPlans = (plans[weekKey] ?? []).map((plan) =>
			plan.id === id ? { ...plan, ...transform(plan) } : plan
		)
		updatePlans(weekKey, updatedPlans)
	}

	return [plans, updatePlans, updatePlan] as const
}

export function useWeek() {
	const now = new Date()
	now.setUTCHours(0, 0, 0, 0)

	const [weekStart, setWeekStart] = useState<Date>(getWeekStart(now))

	const incrementWeek = () => {
		setWeekStart(addOneWeek(weekStart))
	}

	const decrementWeek = () => {
		setWeekStart(subtractOneWeek(weekStart))
	}

	const weekEnd = getWeekEnd(weekStart)

	return [weekStart, weekEnd, incrementWeek, decrementWeek] as const
}

export function useEditingID() {
	const [editingID, setEditingID] = useState<string | null>(null)

	const cancelEditing = () => {
		setEditingID(null)
	}

	return [editingID, setEditingID, cancelEditing] as const
}
