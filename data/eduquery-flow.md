flowchart TD
    Landing[Landing Page] --> Auth{Authentication}
    Auth -->|Login/Register| UserType{Select User Type}
    
    %% Educator Flow
    UserType -->|Educator| EduDash[Educator Dashboard]
    EduDash --> ContentCreate[Content Creation]
    EduDash --> EduAnalytics[Analytics]
    EduDash --> CollabTools[Collaborative Tools]
    EduDash --> Market[Marketplace]
    
    ContentCreate --> QuizGen[Quiz Generator]
    ContentCreate --> LessonPlan[Lesson Plan Builder]
    ContentCreate --> Assignment[Assignment Creator]
    ContentCreate --> Templates[Templates]
    
    EduAnalytics --> StudentPerf[Student Performance]
    EduAnalytics --> EngageMetrics[Engagement Metrics]
    EduAnalytics --> Reports[Reports]
    
    %% Student Flow
    UserType -->|Student| StudDash[Student Dashboard]
    StudDash --> Learning[Learning Path]
    StudDash --> Practice[Practice Zone]
    StudDash --> Collab[Collaboration]
    StudDash --> Resources[Resources]
    
    Learning --> Assessment[Skill Assessment]
    Learning --> Recommend[Recommendations]
    Learning --> Progress[Progress Tracking]
    
    Practice --> Quiz[Take Quiz]
    Practice --> AITutor[AI Tutor]
    Practice --> Study[Study Materials]
    
    Collab --> Virtual[Virtual Classroom]
    Collab --> Forum[Discussion Forum]
    Collab --> PeerLearn[Peer Learning]
    
    %% Institution Flow
    UserType -->|Institution| InstDash[Institution Dashboard]
    InstDash --> InstAnalytics[Analytics Dashboard]
    InstDash --> UserMgmt[User Management]
    InstDash --> CourseMgmt[Course Management]
    InstDash --> Integration[LMS Integration]
    
    InstAnalytics --> Performance[Performance Metrics]
    InstAnalytics --> Curriculum[Curriculum Analytics]
    InstAnalytics --> TeacherStats[Teacher Statistics]
    
    %% Marketplace Flow
    Market --> Browse[Browse Resources]
    Market --> Upload[Upload Resources]
    Market --> Cart[Shopping Cart]
    Market --> Orders[Order History]
    
    %% Common Features
    subgraph Common Features
        Profile[Profile Settings]
        Notifications[Notifications]
        Support[Help & Support]
    end
    
    EduDash --> Common Features
    StudDash --> Common Features
    InstDash --> Common Features
    
    %% Styling
    classDef primary fill:#d4e6ff,stroke:#3b82f6,stroke-width:2px
    classDef secondary fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px
    classDef tertiary fill:#d1fae5,stroke:#059669,stroke-width:2px
    classDef common fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    
    class Landing,Auth,UserType primary
    class EduDash,ContentCreate,EduAnalytics,CollabTools,Market secondary
    class StudDash,Learning,Practice,Collab,Resources tertiary
    class InstDash,InstAnalytics,UserMgmt,CourseMgmt,Integration secondary
    class Common Features common
