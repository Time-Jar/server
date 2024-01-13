
export async function tensorFlowApi(userId: string, appNameId: number, weekday: number, timeOfDay: string, locationId: number): Promise<boolean> {
    
    const response = await fetch("http://supabase-tensorflow-api:5000/predict", 
        { 
            method: 'POST', 
            body: JSON.stringify(
                { 
                    "userId": userId,
                    "appNameId": appNameId,
                    "weekday": weekday,
                    "timeOfDay": timeOfDay,
                    "locationId": locationId
                }
            ),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    if (!response.ok) {
        throw Error(`Error in response: ${response.status} ${response.statusText} ${await response.text()}`)
    }

    const prediction = (await response.json()).prediction

    console.debug(userId, "prediction raw:", prediction)

    const shouldBlock = prediction > 0.5

    return shouldBlock
}