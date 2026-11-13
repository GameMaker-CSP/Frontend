# GameMaker frontend and backend

Current localhost architecture. The frontend displays the interface; Flask checks requests and reads or updates the database.

```mermaid
flowchart TB
    person([Player])

    subgraph frontend["Frontend · localhost:4700"]
        direction TB
        server["Jekyll server<br/>HTML · shared OCS Sass · JavaScript"]
        subgraph browser["Player's browser"]
            account["Login and Profile pages"]
            play["Play workspace<br/>OpenCS Workbench · Open World · Racing"]
            client["JavaScript fetch<br/>API address from config.js"]
            drafts[("Browser storage<br/>Workspace drafts and local saves")]
        end
        server -->|Serves pages and assets| account
        server -->|Serves pages and assets| play
        account -->|Form input| client
        play <-->|Save and load locally| drafts
    end

    subgraph backend["Backend · Flask · localhost:8424"]
        direction TB
        login["POST /api/authenticate<br/>Check credentials and issue login cookie"]
        profile["GET /api/id · PUT /api/user<br/>Check login cookie; read or update profile"]
        userModel["User model<br/>Python + SQLAlchemy"]
        games["Existing saved-game API<br/>/api/game/save · list · load · delete<br/>For the newer editor"]
        gameModel["Game model<br/>Python + SQLAlchemy"]
        database[("SQLite database<br/>Users and saved games")]
        login -->|Look up user| userModel
        profile <-->|Read or update user| userModel
        userModel <-->|Database queries| database
        games <-->|Read or write owned games| gameModel
        gameModel <-->|Database queries| database
    end

    person -->|Sign in or edit profile| account
    person -->|Build and play| play
    client -->|Credentials as JSON| login
    login -->|Response and login cookie| client
    client -->|Request with login cookie| profile
    profile -->|JSON result or error| client
    client -->|Show result or error| account
    play -.->|Planned account-save integration| games

    classDef frontendNode fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e;
    classDef backendNode fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef storageNode fill:#fef3c7,stroke:#d97706,color:#78350f;
    class server,account,play,client frontendNode;
    class login,profile,userModel,games,gameModel backendNode;
    class drafts,database storageNode;
```

**Solid arrows:** existing connections. **Dotted arrow:** planned integration. The inherited builders' account-save requests use `/api/gamebuilder`, which this backend does not implement; connecting them to `/api/game/*` requires adapting their save formats.

The default local database is `Backend/instance/volumes/user_management.db`. Browser saves stay on the current device and site address.

Source references: [frontend API configuration](../assets/js/api/config.js), [backend user API](../../Backend/api/user.py), [backend game API](../../Backend/api/game_api.py), and [localhost demo instructions](LOCAL_DEMO.md).
