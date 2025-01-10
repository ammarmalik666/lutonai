import EventForm from "./event-form"

interface PageProps {
    params: Promise<{
        id: string
    }>
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function EventPage({ params }: PageProps) {
    const { id } = await params
    return <EventForm id={id} />
} 