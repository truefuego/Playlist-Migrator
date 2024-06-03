export const GenericApi = ({API_URL,PAYLOAD}) => {
    const callAPI = async() => {
        try{
            const result = await fetch(API_URL,PAYLOAD)
            if(!result.ok) {
                const errorDetails = await result.json().catch(() => ({}));
                const errorMessage = `Error: ${result.status} ${result.statusText} - ${JSON.stringify(errorDetails)}`;
                throw new Error(errorMessage);
            }
            return await result.json()
        }
        catch(err) {
            alert(err)
        }
    }
    return callAPI()
}