import { useState, useEffect } from "react"

/**
 * Creates a custom hook that stores a value in local storage.
 */
export function useLocalStorage<T>(
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
		const hasStoredValue = localStorage.getItem(key) !== null
		return hasStoredValue ? JSON.parse(localStorage.getItem(key)!) : defaultValue
	} catch (_) {
		return defaultValue
	}
}
