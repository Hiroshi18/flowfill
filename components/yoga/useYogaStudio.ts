"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	getYogaStudioById,
	YOGA_STUDIOS,
	type YogaStudio,
} from "@/lib/yoga-studios";

const STORAGE_KEY = "flowfill.yoga.activeStudioId";

export type { YogaStudio };
export { YOGA_STUDIOS, getYogaStudioById };

export function useYogaStudio() {
	const searchParams = useSearchParams();
	const studioFromUrl = searchParams.get("studio");

	const [studioId, setStudioId] = useState<string>("prana");

	useEffect(() => {
		if (studioFromUrl) {
			const match = getYogaStudioById(studioFromUrl);
			if (match) {
				setStudioId(match.id);
				try {
					window.localStorage.setItem(STORAGE_KEY, match.id);
				} catch {
					// ignore
				}
				return;
			}
		}
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (stored) setStudioId(stored);
	}, [studioFromUrl]);

	const studio = useMemo(() => getYogaStudioById(studioId) ?? YOGA_STUDIOS[0], [studioId]);

	function setActiveStudio(nextId: string) {
		const match = getYogaStudioById(nextId);
		if (!match) return;
		setStudioId(String(match.id));
		try {
			window.localStorage.setItem(STORAGE_KEY, match.id);
		} catch {
			// ignore
		}
	}

	return { studioId, studio, setActiveStudio };
}
