export type PlanData = {
	id: string
	name: string
	done: boolean
}

export type PlanProps = {
	editingID: string | null
	renamePlan: (name: string) => void
	setEditingID: (id: string | null) => void
	toggleDone: () => void
	moveToNextWeek: () => void
	moveToPreviousWeek: () => void
	deletePlan: () => void
}
