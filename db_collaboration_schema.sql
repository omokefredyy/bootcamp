-- Direct Messages Table
create table direct_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  sender_name text not null,
  receiver_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Collaboration Messages Table (for project-specific chat)
create table collaboration_messages (
  id uuid default uuid_generate_v4() primary key,
  room_id text not null,
  sender_id uuid references profiles(id) not null,
  sender_name text not null,
  content text not null,
  message_type text check (message_type in ('text', 'code', 'file')) default 'text',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Collaboration Rooms Table
create table collaboration_rooms (
  id uuid default uuid_generate_v4() primary key,
  room_name text not null,
  bootcamp_id uuid references bootcamps(id),
  created_by uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Collaboration Room Members
create table collaboration_room_members (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references collaboration_rooms(id) not null,
  user_id uuid references profiles(id) not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(room_id, user_id)
);

-- Enable RLS
alter table direct_messages enable row level security;
alter table collaboration_messages enable row level security;
alter table collaboration_rooms enable row level security;
alter table collaboration_room_members enable row level security;

-- RLS Policies for Direct Messages
create policy "Users can view their own messages" on direct_messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages" on direct_messages
  for insert with check (auth.uid() = sender_id);

-- RLS Policies for Collaboration
create policy "Room members can view messages" on collaboration_messages
  for select using (
    exists (
      select 1 from collaboration_room_members
      where room_id = collaboration_messages.room_id::uuid
      and user_id = auth.uid()
    )
  );

create policy "Room members can send messages" on collaboration_messages
  for insert with check (
    exists (
      select 1 from collaboration_room_members
      where room_id = room_id::text::uuid
      and user_id = auth.uid()
    )
  );

create policy "Anyone can view rooms" on collaboration_rooms for select using (true);
create policy "Authenticated users can create rooms" on collaboration_rooms for insert with check (auth.uid() = created_by);

create policy "Room members can view membership" on collaboration_room_members for select using (true);
create policy "Users can join rooms" on collaboration_room_members for insert with check (auth.uid() = user_id);
