export default function useClassName(names: (string | false | undefined | null)[]): string {
    return names.filter(Boolean).join(" ");
}