# Stock Analysis AI Chatbot

A modern AI-powered stock analysis chatbot built with **Vercel AI SDK v5**, **Next.js 15**, and **Google Gemini**. This template demonstrates tool calling with real financial data from [FinancialModelingPrep](https://financialmodelingprep.com/).

![Stock Analysis Chatbot](https://via.placeholder.com/800x400?text=Stock+Analysis+AI+Chatbot)

## Features

- 📈 Real-time stock quotes and intraday prices
- 📊 Historical price charts with date range selection
- 💰 Earnings data with EPS and revenue tracking
- 🎯 Analyst consensus ratings visualization
- 🏢 Comprehensive company profiles
- 💬 Natural language interface powered by AI
- ⚡ Streaming responses for real-time updates

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd tool-calling-template
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Google AI API Key (for Gemini)
# Get your key at: https://aistudio.google.com/
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Financial Modeling Prep API Key
# Get your FREE key at: https://financialmodelingprep.com/developer/docs
FMP_API_KEY=your_fmp_api_key_here
```

#### Getting Your API Keys

1. **Google Gemini API Key** (Free)
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Create a new API key

2. **FinancialModelingPrep API Key** (Free tier available)
   - Visit [FinancialModelingPrep](https://financialmodelingprep.com/developer/docs)
   - Create a free account
   - Copy your API key from the dashboard

### 3. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Tools

The chatbot has access to the following tools for fetching and analyzing stock data:

### 1. Intraday Price (`intradayPrice`)

Get the current real-time quote for a stock including price, change, volume, and market data.

**Example prompts:**
- "What's the current price of Apple?"
- "Show me TSLA's stock price"
- "How is NVIDIA doing today?"
- "Get me a quote for Microsoft"

**Data includes:** Current price, price change ($ and %), volume, day high/low, year high/low, market cap, 50-day and 200-day moving averages.

---

### 2. Historical Prices (`historicalPrices`)

Get historical end-of-day prices for a stock within a specified date range. Defaults to the last year if no dates are provided.

**Example prompts:**
- "Show me Apple's stock history for the past year"
- "How has Tesla performed over the last 6 months?"
- "Get historical prices for GOOGL from January to March 2024"
- "Chart Amazon's stock price history"

**Data includes:** Daily closing prices with volume data, displayed in an interactive chart.

---

### 3. Earnings Historical (`earningsHistorical`)

Get the latest earnings data including EPS (Earnings Per Share) and revenue, comparing actual vs estimated figures.

**Example prompts:**
- "Show me Apple's recent earnings"
- "How did Tesla's last quarter earnings compare to estimates?"
- "Get earnings history for NVIDIA"
- "Did Microsoft beat earnings expectations?"

**Data includes:** Last 6 quarters of EPS actual vs estimated, revenue actual vs estimated, displayed in a visual chart.

---

### 4. Analyst Ratings (`gradesConsensus`)

Get analyst consensus ratings showing the distribution of Strong Buy, Buy, Hold, Sell, and Strong Sell recommendations.

**Example prompts:**
- "What do analysts think about Apple stock?"
- "Show me analyst ratings for Tesla"
- "Is NVIDIA a buy according to analysts?"
- "Get the consensus rating for Amazon"

**Data includes:** Number of analysts for each rating category (Strong Buy, Buy, Hold, Sell, Strong Sell) and overall consensus recommendation.

---

### 5. Company Profile (`companyProfile`)

Get comprehensive company information including business description, financial metrics, and corporate details.

**Example prompts:**
- "Tell me about Apple as a company"
- "What does Tesla do?"
- "Give me an overview of NVIDIA"
- "Who is the CEO of Microsoft?"

**Data includes:** Company description, sector, industry, CEO, headquarters, employee count, market cap, beta, dividend info, and more.

---

## Supported Stocks (FMP Free Tier)

The free tier of FinancialModelingPrep API supports the following stocks:

| Symbol | Company Name |
|--------|-------------|
| AAPL | Apple Inc. |
| TSLA | Tesla Inc. |
| AMZN | Amazon.com Inc. |
| MSFT | Microsoft Corporation |
| NVDA | NVIDIA Corporation |
| GOOGL | Alphabet Inc. (Class A) |
| META | Meta Platforms Inc. |
| NFLX | Netflix Inc. |
| JPM | JPMorgan Chase & Co. |
| V | Visa Inc. |
| BAC | Bank of America Corporation |
| AMD | Advanced Micro Devices Inc. |
| PYPL | PayPal Holdings Inc. |
| DIS | The Walt Disney Company |
| T | AT&T Inc. |
| PFE | Pfizer Inc. |
| COST | Costco Wholesale Corporation |
| INTC | Intel Corporation |
| KO | The Coca-Cola Company |
| TGT | Target Corporation |
| NKE | Nike Inc. |
| SPY | SPDR S&P 500 ETF Trust |
| BA | The Boeing Company |
| BABA | Alibaba Group Holding Ltd. |
| XOM | Exxon Mobil Corporation |
| WMT | Walmart Inc. |
| GE | General Electric Company |
| CSCO | Cisco Systems Inc. |
| VZ | Verizon Communications Inc. |
| JNJ | Johnson & Johnson |
| CVX | Chevron Corporation |
| PLTR | Palantir Technologies Inc. |
| SQ | Block Inc. |
| SHOP | Shopify Inc. |
| SBUX | Starbucks Corporation |
| SOFI | SoFi Technologies Inc. |
| HOOD | Robinhood Markets Inc. |
| RBLX | Roblox Corporation |
| SNAP | Snap Inc. |
| UBER | Uber Technologies Inc. |
| FDX | FedEx Corporation |
| ABBV | AbbVie Inc. |
| ETSY | Etsy Inc. |
| MRNA | Moderna Inc. |
| LMT | Lockheed Martin Corporation |
| GM | General Motors Company |
| F | Ford Motor Company |
| RIVN | Rivian Automotive Inc. |
| LCID | Lucid Group Inc. |
| CCL | Carnival Corporation & plc |
| DAL | Delta Air Lines Inc. |
| UAL | United Airlines Holdings Inc. |
| AAL | American Airlines Group Inc. |
| TSM | Taiwan Semiconductor Manufacturing Co. |
| SONY | Sony Group Corporation |
| ET | Energy Transfer LP |
| NOK | Nokia Corporation |
| MRO | Marathon Oil Corporation |
| COIN | Coinbase Global Inc. |
| SIRI | Sirius XM Holdings Inc. |
| RIOT | Riot Platforms Inc. |
| CPRX | Catalyst Pharmaceuticals Inc. |
| VWO | Vanguard FTSE Emerging Markets ETF |
| SPYG | SPDR Portfolio S&P 500 Growth ETF |
| ROKU | Roku Inc. |
| VIAC | Paramount Global (formerly ViacomCBS) |
| ATVI | Activision Blizzard Inc. |
| BIDU | Baidu Inc. |
| DOCU | DocuSign Inc. |
| ZM | Zoom Video Communications Inc. |
| PINS | Pinterest Inc. |
| TLRY | Tilray Brands Inc. |
| WBA | Walgreens Boots Alliance Inc. |
| MGM | MGM Resorts International |
| NIO | NIO Inc. |
| C | Citigroup Inc. |
| GS | The Goldman Sachs Group Inc. |
| WFC | Wells Fargo & Company |
| ADBE | Adobe Inc. |
| PEP | PepsiCo Inc. |
| UNH | UnitedHealth Group Incorporated |
| CARR | Carrier Global Corporation |
| FUBO | FuboTV Inc. |
| HCA | HCA Healthcare Inc. |
| TWTR | Twitter Inc. (pre-acquisition by X Corp.) |
| BILI | Bilibili Inc. |
| RKT | Rocket Companies Inc. |

