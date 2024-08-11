import { useStore } from "../../zustand";

export function Target() {
  const target = useStore((state) => state.roomState!.round?.target);

  if (target === undefined) {
    return null;
  }
  return (
    <div>
      <h4>Target: {target}</h4>
    </div>
  );
}
