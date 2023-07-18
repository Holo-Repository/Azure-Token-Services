import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";


const secretName = "FluidRelayKey";


export async function JWTProvider(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`JWTProvider called with query params: ${JSON.stringify(req.query)}`);

    const key = process.env[secretName] as string | undefined;
    if (!key)
        return { status: 404, body: `No key found for the provided secret name: ${secretName}` };
    return { status: 200, body: key };

    // tenantId, documentId, userId and userName are required parameters
    const tenantId = req.query.get('tenantId') as string;
    const documentId = req.query.get('documentId') as string | undefined;
    const userId = req.query.get('userId') as string;
    const userName = req.query.get('userName') as string;
    let scopes = JSON.parse(req.query.get('scopes') ?? '[]') as ScopeType[] | undefined;
    scopes = scopes && scopes.length > 0 ? scopes : undefined;

    if (!tenantId)
        return { status: 400, body: "No tenantId provided in query params" };

    if (!key)
        return { status: 404, body: `No key found for the provided tenantId: ${tenantId}` };

    let user = { name: userName, id: userId };

    // Will generate the token and returned by an ITokenProvider implementation to use with the AzureClient.
    const token = generateToken(
        tenantId,
        key,
        scopes ?? [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
        documentId,
        user
    );

    return {
        status: 200,
        body: token
    };

};

app.http('JWTProvider', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: JWTProvider
});
