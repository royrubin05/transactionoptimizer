import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

export const plaidClient = new PlaidApi(configuration);

export async function createLinkToken(userId: string) {
    const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: 'SubTrack',
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
    });
    return response.data.link_token;
}

export async function exchangePublicToken(publicToken: string) {
    const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
    });
    return {
        accessToken: response.data.access_token,
        itemId: response.data.item_id,
    };
}

export async function getAccounts(accessToken: string) {
    const response = await plaidClient.accountsGet({
        access_token: accessToken,
    });
    return response.data.accounts;
}

export async function getTransactions(accessToken: string, startDate: string, endDate: string) {
    const response = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
    });
    return response.data.transactions;
}
