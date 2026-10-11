jest.mock('axios');

const axios = require('axios').default;
const mockGet = jest.fn();
axios.create.mockReturnValue({ get: mockGet });

const { scanApi } = require('./api');

describe('scanApi.getDashboardStats', () => {
    afterEach(() => {
        mockGet.mockReset();
    });

    it('shares an in-flight dashboard request and allows a later refresh', async () => {
        let resolveRequest;
        mockGet.mockReturnValue(new Promise((resolve) => {
            resolveRequest = resolve;
        }));

        const firstRequest = scanApi.getDashboardStats();
        const duplicateRequest = scanApi.getDashboardStats();

        expect(duplicateRequest).toBe(firstRequest);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith('/scans/stats/dashboard');

        resolveRequest({ data: {} });
        await firstRequest;

        mockGet.mockResolvedValueOnce({ data: { totalScans: 1 } });
        await scanApi.getDashboardStats();

        expect(mockGet).toHaveBeenCalledTimes(2);
    });
});
