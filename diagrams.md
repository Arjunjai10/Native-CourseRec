# EduLearn Platform System Diagrams

This document contains the core architectural diagrams for the AI Course Recommendation System.

---

## 5.1 Use Case Diagram
The Use Case diagram illustrates how the User (Learner) and Admin (System) interact with the various functional modules of the platform.

```mermaid
useCaseDiagram
    actor "Learner (User)" as U
    actor "System / Admin" as A
    
    package "Core Platform" {
        usecase "Authenticate (BCrypt Login/Signup)" as UC1
        usecase "Ask AI Mentor for Advice" as UC2
        usecase "Discover Global Courses" as UC3
        usecase "Save Recommendation to Library" as UC4
        usecase "Switch Backend Stack (Node/Java)" as UC5
        usecase "Update Career Bio & Interests" as UC6
    }
    
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC6
    
    A --> UC1
    A --> UC3
    A --> UC5
```

---

## 5.2 Class Diagram
The Class diagram outlines the data structure and relationship between the Core Models and Controllers across the Hybrid Architecture.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String fullName
        +String bio
        +List<String> interests
        +ArrayList<Course> enrolledCourses
        +saveRecommendation()
        +updateProfile()
    }
    
    class Course {
        +String id
        +String title
        +String category
        +String level
        +String externalLink
        +Double rating
        +Instructor instructor
    }
    
    class Instructor {
        +String name
        +String avatar
        +String title
    }
    
    class AIMentor {
        +GeminiModel engine
        +getAdvice(prompt)
        +analyzeCatalog(courses)
    }
    
    class HybridAPI {
        +String activePort
        +switchToServer(port)
        +fetchProfile()
        +fetchDiscovery()
    }
    
    User "1" -- "*" Course : saves
    Course "1" -- "1" Instructor : belongs to
    App "1" -- "1" AIMentor : uses
    App "1" -- "1" HybridAPI : orchestrates
```

---

## 5.3 Activity Diagram
This diagram shows the logical flow of a user seeking a tailored recommendation from the AI Mentor.

```mermaid
activityDiagram
    start
    :User enters career goal in AI Chat;
    :App gathers active Courses from MongoDB;
    :App sends prompt + metadata to Gemini;
    if (Gemini finds match?) then (yes)
        :Gemini returns structured curriculum;
        :App highlights matching from Database;
        :User views Discovery path;
        :User clicks "Add to Library";
        :Sync update to MongoDB (User.enrolled);
    else (no)
        :Gemini provides general guidance;
    endif
    stop
```

---

## 5.4 Sequence Diagram
The following represents the "BCrypt Handshake" flow across a Node.js-to-Java migration.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Java_Backend (8080)
    participant Node_Backend (5000)
    participant MongoDB

    User->>Frontend: Register credentials (Node Active)
    Frontend->>Node_Backend: POST /signup
    Node_Backend->>Node_Backend: Hash Password (BCrypt)
    Node_Backend->>MongoDB: Save User Document
    Node_Backend-->>Frontend: JWT Issued
    
    Note over User, MongoDB: [Switching to Java Port 8080 in Settings]
    
    User->>Frontend: Login credentials (Java Active)
    Frontend->>Java_Backend: POST /login
    Java_Backend->>MongoDB: GET User by Email
    MongoDB-->>Java_Backend: Returns Hashed Password
    Java_Backend->>Java_Backend: encoder.matches(raw, hash)
    Java_Backend-->>Frontend: Success Response
```

---

## 5.5 State Diagram
The State diagram represents the "Discovery Lifecycle" of a course recommendation.

```mermaid
stateDiagram-v2
    [*] --> Discovered: Catalog Initialization
    Discovered --> AI_Evaluating: User Query Prompted
    AI_Evaluating --> Matched: Affinity > 80%
    AI_Evaluating --> Suggested: High Similarity
    
    Matched --> Saved: User clicks Bookmark
    Suggested --> Saved: User clicks Bookmark
    
    Saved --> Archived: User removes from Library
    Archived --> Matched: User re-discovers
    
    Saved --> [*]
```
