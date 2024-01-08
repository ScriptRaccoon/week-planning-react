import { useState, useEffect } from "react"

export function useLocalStorage<T>(
	key: string,
	defaultValue: T,
	update: (value: T) => void = () => {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
	let initialValue: T

	try {
		const hasStoredValue = localStorage.getItem(key) !== null
		initialValue = hasStoredValue
			? JSON.parse(localStorage.getItem(key)!)
			: defaultValue
	} catch (_) {
		initialValue = defaultValue
	}

	const [value, setValue] = useState<T>(initialValue)

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
		update(value)
	}, [value, key, update])

	return [value, setValue]
}
