## PERIPHERAL interfacing Explained

Peripheral emulation is usually easier to achieve compared to building real hardware, as we can ignore the electrical and signal or logic layer including a major part of the electronic circuitry.  Our only real concern is software compatibility, which comes down to minding about the entire memory map dedicated to I/O, which is exactly 4K wide  (between $C000 - $D000). Here is an enlarged map of this memory space :

          <div style=width:800px>
     D000 ┌────────────────────────────────────┐   ▲
          │                                    │   │
          │   Open for large ROM programs      │  2024 bytes
          │   Activated by I/O strobe (pin 20) │   │
          │                                    │   │
     C800 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#7           │   │  
          │                                    │  256 bytes
     C700 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#6           │   │ 
          │                                    │  256 bytes
     C600 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#5           │   │
          │                                    │  256 bytes
     C500 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#4           │   │
          │                                    │  256 bytes
     C400 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#3           │   │
          │                                    │  256 bytes
     C300 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#2           │   │
          │                                    │  256 bytes
     C200 ├────────────────────────────────────┤  ─┘
          │                                    │   ▲
          │  RAM/ROM open for slot#1           │   │
          │                                    │  256 bytes
     C100 └───┬────────────────────────────────┤  ─┘
         C0F0 │  I/O slot #7  ─┐ 8*16 bytes    │   ▲
         C0E0 │  I/O slot #6  ─┘               │   │       
         C0D0 │ I/O slot #5                    │  128 bytes
         C0C0 │ I/O slot #4                    │   │
         C0B0 │ I/O slot #3                    │   │
         C0A0 │ I/O slot #2                    │   │
         C090 │ I/O slot #1                    │   │
         C080 │ I/O slot #0                    │   │
     C080 ┌───┴────────────────────────────────┤  ─┘
          │  Built-in I/O locations            │   ▲
          │  (keyboard,speaker,casette,game..  │  128 bytes
     C000 └────────────────────────────────────┘  ─┘
  
          
          </div>