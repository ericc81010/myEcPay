import { WebClientService } from './WebClient.service';

jest.mock('axios');

describe('WebClientService', () => {
  let webClientService: WebClientService;

  beforeEach(() => {
    webClientService = new WebClientService();
  });

  it('should be defined webClientService', () => {
    expect(webClientService).toBeDefined();
  });
});
