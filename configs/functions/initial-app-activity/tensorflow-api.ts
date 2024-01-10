
export async function tensorFlowApi(userId: string): Promise<boolean> {
    
    const response = await fetch("supabase-tensorflow-api:5000", 
        { 
            method: 'POST', 
            body: JSON.stringify({ "userId": userId })
        }
    )

    if (!response.ok) {
        throw Error(`Error in response: ${response.status} ${response.statusText} ${await response.text()}`)
    }
    const shouldBlock = (await response.json()).shouldBlock

    return shouldBlock
}