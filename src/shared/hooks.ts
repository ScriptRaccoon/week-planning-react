import { useState, useEffect } from "react"
import { PlanData } from "./types"
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
	const [plans, setPlans] = useLocalStorage<Record<string, PlanData[]>>(
		"plansReact",
		{}
	)

	function updatePlans(weekKey: string, updatedPlans: PlanData[]): void {
		setPlans((plans) => ({ ...plans, [weekKey]: updatedPlans }))
	}

	return [plans, updatePlans] as const
}

export function useWeek() {
	const now = new Date()
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
