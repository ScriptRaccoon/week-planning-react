import { useState, useEffect } from "react"

export function useLocalStorage<T>(
	key: string,
	defaultValue: T,
	update: (value: T) => void = () => {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() =>
		getStoredValue(key, defaultValue)
	)

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
		update(value)
	}, [value, key, update])

	return [value, setValue]
}

function getStoredValue<T>(key: string, defaultValue: T): T {
	try {
		const hasStoredValue = localStorage.getItem(key) !== null
		return hasStoredValue
			? JSON.parse(localStorage.getItem(key)!)
			: defaultValue
	} catch (_) {
		return defaultValue
	}
}
