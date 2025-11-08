import '@testing-library/jest-dom';

jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((body, init) => {
        const mockJson = jest.fn(async () => body);

        return {
          status: init?.status || 200,
          json: mockJson,
        };
      }),
    },
  };
});
