from fastapi import APIRouter, HTTPException
from pathlib import Path
import json

router = APIRouter(prefix="/curriculum", tags=["curriculum"])

LESSONS_DIR = Path(__file__).parent.parent / "lessons"

MODULE_DIRS = {
    "mod01": "mod01_bazele",
    "mod02": "mod02_control",
    "mod03": "mod03_elementari",
    "mod04": "mod04_vectori",
    "mod05": "mod05_matrice",
}


@router.get("/{lesson_id}")
async def get_lesson_json(lesson_id: str):
    """Return lesson JSON content from the file-based curriculum layer."""
    parts = lesson_id.split("_")
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Invalid lesson_id — expected format: mod01_01")

    module_key = parts[0]  # "mod01"
    folder_name = MODULE_DIRS.get(module_key)
    if not folder_name:
        raise HTTPException(status_code=404, detail=f"Module '{module_key}' not found")

    module_dir = LESSONS_DIR / folder_name
    matches = list(module_dir.glob(f"{lesson_id}_*.json"))
    if not matches:
        raise HTTPException(status_code=404, detail=f"Lesson '{lesson_id}' not found")

    with open(matches[0], "r", encoding="utf-8") as f:
        return json.load(f)
