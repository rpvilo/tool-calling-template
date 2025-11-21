// @/lib/fmp-client.ts
// Financial Modeling Prep API Client

type Params = Record<string, string | number | undefined>;

export class FMPClient {
  private baseUrl: string;
  private apiKey: string;
  private headers: Record<string, string>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? (process.env.FMP_API_KEY as string);
    this.baseUrl = "https://financialmodelingprep.com/stable";
    this.headers = {
      "Content-Type": "application/json",
    };

    if (!this.apiKey) {
      throw new Error(
        "FMP_API_KEY is required. Provide it as a constructor argument or set FMP_API_KEY environment variable.",
      );
    }
  }

  private buildUrl = (path: string, params?: Params): URL => {
    const normalizedBase = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(normalizedPath, normalizedBase);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    url.searchParams.set("apikey", this.apiKey);

    return url;
  };

  async fetch<T = unknown>(
    path: string,
    options: { params?: Params; timeout?: number } = {},
  ): Promise<T> {
    const url = this.buildUrl(path, options.params);

    const response = await fetch(url.toString(), {
      headers: this.headers,
      signal: AbortSignal.timeout(options?.timeout ?? 20000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FMP API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    return data as T;
  }
}

export const fmpClient = new FMPClient();
